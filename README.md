# [do](https://do.omrilotan.com) [![](https://img.shields.io/github/actions/workflow/status/omrilotan/do/publish.yml?branch=main&logo=github&style=flat-square)](https://github.com/omrilotan/do/actions/workflows/publish.yml) ![](https://img.shields.io/github/commit-activity/m/omrilotan/do?style=flat-square) ![](https://img.shields.io/github/contributors/omrilotan/do?style=flat-square) ![](https://img.shields.io/uptimerobot/ratio/7/m783966646-c77ee5ccd11a66fe751807af?style=flat-square)

## do something fun

On the go activities to do with kids that require no preparations. Draw a [random activity](https://do.omrilotan.com/random/) 🤪. Save and share your favourites. [Suggest your own 🤩](https://github.com/omrilotan/do/issues/new/choose).

<p align="center">
  <a href="https://do.omrilotan.com/random/"><img src="https://user-images.githubusercontent.com/516342/75481509-d4a3b680-59ab-11ea-8262-a76554aff322.png" width="360"></a>
</p>

## Development

Requires the Node.js version in [`.nvmrc`](.nvmrc).

```sh
npm i
npm start       # build, serve on http://127.0.0.1:1337 and rebuild on change
npm test        # unit tests, and activity length, punctuation and spelling checks
npm run format  # prettier
npm run build   # write the site to docs/
```

Pushes to `main` build the site and publish it to the `site` branch, which GitHub Pages serves.
