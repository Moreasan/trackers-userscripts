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
    name: "Find Unique Titles",
    namespace: "http://tampermonkey.net/",
    author: "passthepopcorn_cc",
    match: [
      "https://cinemageddon.net/browse.php*",
      "https://karagarga.in/browse.php*",
      "https://hdbits.org/browse.php*",
      "https://passthepopcorn.me/torrents.php*",
      "https://passthepopcorn.me/torrents.php?type=seeding",
      "https://beyond-hd.me/library/movies*",
      "https://beyond-hd.me/meta*",
      "https://cinemaz.to/movies*",
      "https://avistaz.to/movies*",
      "https://blutopia.xyz/torrents*",
      "https://blutopia.cc/torrents*",
      "https://www.torrentleech.org/torrents/browse*",
      "https://secret-cinema.pw/torrents.php*",
      "https://www.clan-sudamerica.net/invision/*",
      "https://newinsane.info/browse.php*",
      "https://btarg.com.ar/tracker/browse.php*",
      "https://filelist.io/browse.php*",
    ],
    require: [
      `https://cdn.jsdelivr.net/npm/jquery@${pkg.dependencies.jquery}/dist/jquery.min.js`,
    ],
    grant: ["GM.xmlHttpRequest", "GM.setValue", "GM.getValue"],
  }
}
