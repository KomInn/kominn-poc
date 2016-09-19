# Building the project

## Required NPM-packages
This solution is not a .NET Core solution. NPM-packages cannot be deployed with the project since they have extremely long paths. The following NPM packages must be installed:
- bootstrap
- corejs-typeahead
- gulp
- gulp-sass
- jquery
- node-sass- react
- react-dom
- require
- sass
- source-map-loader
- ts-loader
- typescript
- webpack
- webpack-stream 
- xtend

## Tips for configuring your environment
- Map SiteAssets and SitePages as network drives for rapid deployment to on-premises and cloud. Gulp is configured to deploy to mapped folders. 
- Use webpack --watch and run gulp tscauto for rapid TSX-compilation and deployment. Much faster than writing 'webpack' in cmd. 
- CoreJS's Typeahead library is used, since it's the most recently maintained branch. 
