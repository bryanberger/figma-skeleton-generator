# Figma Skeleton Generator

![banner](.github/banner.png?raw=true)

![demo](.github/demo.gif?raw=true)

![banner](.github/demo.png?raw=true)

## Why?

This is an internal tool we use at Discord to generate Discord specific "skeleton/placeholders" for help in designing lofi screens. The idea is to help focus feedback where you need it, and less on your clever/not-so-clever chat messages. This plugin can generate:

- Messages
- Server List
- Channel List (voice and text)
- Member List
## Development

- Run `yarn` to install dependencies.
- Run `yarn build:watch` to start webpack in watch mode.
- Open `Figma` -> `Plugins` -> `Development` -> `New Plugin...` and choose `manifest.json` file from this repo.


## Build
- Run `yarn build` to build a production version.
