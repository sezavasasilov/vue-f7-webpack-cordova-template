const Q = require('q'),
     fs = require('fs'),
     cp = require('child_process'),
     os = require('os'),
   path = require('path'),
 ifaces = os.networkInterfaces(),
  spawn = cp.spawn,
   exec = cp.exec;

module.exports = function(context) {

  function getRouterIpAddr () {
    for (let key in ifaces) {
      if (ifaces.hasOwnProperty(key)) {
        for (let ipInfoKey in ifaces[key]) {
          if (ifaces[key].hasOwnProperty(ipInfoKey)) {
            let ipInfo = ifaces[key][ipInfoKey]

            if (ipInfo.family === 'IPv4' && !ipInfo.internal)
              return ipInfo.address
          }
        }
      }
    }

    return '127.0.0.1'
  }

  const sys = {
    checkNodeModules () {
      let defer = new Q.defer()

      console.log('Checking is node modules installed...');

      if (!fs.existsSync(nodeModulesPath)) {
        console.log('Node modules not found. Installing...');

        exec('npm i', { cwd: pRoot, maxBuffer: 1024 * 1024 * 5 }, (error) => {
          if (error) {
            console.error(`Error happened when npm install: ${error}`);
            defer.reject(new Error(`Error happened when npm install: ${error}`));
          }

          console.log('Node modules installed successfully!');
          defer.resolve();
        });
      }
      else {
        console.log('Node modules already installed.');
        defer.resolve();
      }

      return defer.promise;
    },

    startWebpackBuild (isRelease) {
			let defer = new Q.defer();

			console.log('Starting webpack build...');

			let wpPath = webpackPath + (os.platform() === 'win32' ? '.cmd' : '');

			exec(`"${wpPath}"` + (isRelease ? ' --env.release' : ''), { cwd: pRoot, maxBuffer: 1024 * 1024 * 5 }, (error, log) => {
				if (error) {
					console.error(`Error happened when webpack build: ${error}`);
					defer.reject(new Error(`Error happened when webpack build: ${error}`));
				}

				console.log(`Webpack log: ${log}`);

				console.log('Webpack build completed to www folder successfully!');
				defer.resolve();
			})

			return defer.promise
		},

    startWebpackDevServer (platform) {
      let defer = new Q.defer(),
        outText = '',
        isResultFound = false,
        args = [`"${webpackDevServerPath}"`, '--hot', '--inline'],
        run = epipeBombPath;

      if (os.platform() === 'win32') {
        args = ['--hot', '--inline'];
        run = `"${webpackDevServerPath}.cmd"`;
      }

      let devServerSpawn = spawn(run, args, {
        shell: true,
        cwd: pRoot,
        stdio: [process.stdin, 'pipe', process.stderr]
      })

      devServerSpawn.on('error', (err) => {
        console.log('Failed to start webpack dev server!');
        console.log(err);

        defer.reject(err);
      })

      devServerSpawn.stdout.on('data', (data) => {
        process.stdout.write(data);

        if (!isResultFound) {
          outText += data;

          if (outText.indexOf('bundle is now VALID.') > -1 || outText.indexOf('Compiled successfully.') > -1 || outText.indexOf('Compiled with warnings') > -1) {
            isResultFound = true;
            outText = '';

            // defer.resolve();
          }
        }
      })

      return defer.promise;
    },

    isFoundInCmdline (cmdCommand) {
      return (
        context.cmdLine.indexOf(`cordova ${cmdCommand}`) > -1 ||
        context.cmdLine.indexOf(`phonegap ${cmdCommand}`) > -1
      )
    },

    checkOption (name) {
      return (
        typeof context.opts !== 'undefined' &&
        typeof context.opts.options !== 'undefined' &&
        typeof context.opts.options[name] !== 'undefined' &&
        context.opts.options[name] === true
      )
    },

    deleteFolderRecursive (path, doNotDeleteSelf = false) {
			if (fs.existsSync(path)) {
				fs.readdirSync(path).forEach((file) => {
					let curPath = path + '/' + file
					if (fs.lstatSync(curPath).isDirectory())
						sys.deleteFolderRecursive(curPath);
					else
						fs.unlinkSync(curPath)
				})

				if (!doNotDeleteSelf)
					fs.rmdirSync(path)
			}
		},

		cleanWww () {
			let wwwDir = path.resolve(__dirname, '../www/')
			sys.deleteFolderRecursive(wwwDir, true)
		},

    emptyDefer () {
      let defer = new Q.defer();

      defer.resolve();

      return defer.promise;
    },
  };

  const deferral = new Q.defer(),
        pRoot = context.opts.projectRoot,
        nodeModulesPath = path.resolve(pRoot, 'node_modules/'),
        webpackPath = path.resolve(nodeModulesPath, '.bin/webpack'),
        webpackDevServerPath = path.resolve(nodeModulesPath, '.bin/webpack-dev-server'),
        epipeBombPath = path.resolve(nodeModulesPath, '.bin/epipebomb'),
        platform = context.opts.platforms[0];

  const isBuild = sys.isFoundInCmdline('build'),
        isRun = sys.isFoundInCmdline('run'),
        isEmulate = sys.isFoundInCmdline('emulate'),
        isPrepare = sys.isFoundInCmdline('prepare'),
        isServe = sys.isFoundInCmdline('serve'),
        isRelease = sys.checkOption('release');

  if (context.opts.platforms.length === 0 && !isPrepare) {
		console.log('Update happened. Skipping...');
		deferral.resolve();
	}
	else {
		console.log('Before deploy hook started...');

    sys.checkNodeModules()
      .then(() => {
        sys.cleanWww();

        if (isBuild || isPrepare) {
          return sys.startWebpackBuild(isRelease);
        } else if (isRun || isEmulate || isServe) {
          return sys.startWebpackDevServer(platform);
        } else {
          return sys.emptyDefer();
        }
      })
      .then(() => {
        console.log('Cordova hook completed. Resuming to run your cordova command...');
        deferral.resolve();
      })
      .catch(err => {
        console.log('Error happened on main chain:');
        console.log(err);
        deferral.reject(err);
      })
      .done(() => {
        console.log('Done!');
      });
  };

  return deferral.promise;
}
