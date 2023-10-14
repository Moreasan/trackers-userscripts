import pkg from '../package.json'
import type { UserscriptOptions } from 'webpack-userscript'

interface IWebpackUserScript {
  /* userscript version */
  scriptVersion: string

  /* homepage url (github pages) */
  scriptHomePage: string

  /* script file name, without file extension */
  scriptFileName: string

  /**
   * userscript headers
   * including script name, description, match url, grants and so on
   * see https://www.tampermonkey.net/documentation.php for details
   **/
  scriptHeaders: UserscriptOptions['headers']
}

export const UserScriptConfig: IWebpackUserScript = {
  scriptVersion: pkg.version,
  scriptHomePage: pkg.homepage,
  scriptFileName: pkg.name,
  scriptHeaders: {
    name: "PurchasableChecker",
    namespace: "http://tampermonkey.net/",
    author: "Mea01",
    include: [
      "https://passthepopcorn.me/requests.php*",
    ],
    require: [
      `https://cdn.jsdelivr.net/npm/jquery@${pkg.dependencies.jquery}/dist/jquery.min.js`,
    ],
    grant: ["GM.xmlHttpRequest", "GM.setValue", "GM.getValue"],
  }
}
