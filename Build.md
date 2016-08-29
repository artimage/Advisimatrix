https://medium.com/@leonardykris/how-to-run-a-meteor-js-application-on-heroku-in-10-steps-7aceb12de234#.6grrcq8i0

Where I get steps to run on Heroku.

but I'm now using Horse Buildpack
heroku buildpacks:set https://github.com/AdmitHub/meteor-buildpack-horse.git

Need to set this to stop weird meteor error:
BUILDPACK_CLEAR_CACHE="1"
via https://github.com/AdmitHub/meteor-buildpack-horse/issues/134
