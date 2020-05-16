# neogma-docs

# [Documentation webpage index](https://themetalfleece.github.io/neogma-docs)

## This is the repository for the documentation of [neogma](https://github.com/themetalfleece/neogma)

The docs are built with [codedoc](https://github.com/CONNECT-platform/codedoc)

The source files are in the `md` directory.

## Building the docs
1) Install codedoc, npm
2) Navigate to this repo's directory, then to `./.codedoc`. Run `npm i`
3) To serve the docs for developing, navigate to this repo's directory and run `codedoc serve`. To access them, navigate to the url displayed in the terminal
4) To build the static files to serve withe a web server, run `codedoc build`. The files will be build to the `docs` and `assets` directory

## Contributing
Before pushing, make sure you've built the docs with `codedoc build`