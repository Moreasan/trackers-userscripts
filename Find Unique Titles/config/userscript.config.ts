import pkg from "../package.json";
import type { UserscriptOptions } from "webpack-userscript";

interface IWebpackUserScript {
  /* userscript version */
  scriptVersion: string;

  /* homepage url (github pages) */
  scriptHomePage: string;

  /* script file name, without file extension */
  scriptFileName: string;

  /**
   * userscript headers
   * including script name, description, match url, grants and so on
   * see https://www.tampermonkey.net/documentation.php for details
   **/
  scriptHeaders: UserscriptOptions["headers"];
}

export const UserScriptConfig: IWebpackUserScript = {
  scriptVersion: pkg.version,
  scriptHomePage: "",
  scriptFileName: pkg.name,
  scriptHeaders: {
    name: "Find Unique Titles",
    namespace: "http://tampermonkey.net/",
    author: "Mea01",
    match: [
      "https://aither.cc/torrents?*",
      "https://avistaz.to/movies*",
      "https://beyond-hd.me/torrents*",
      "https://beyond-hd.me/library/*",
      "https://blutopia.cc/torrents?*",
      "https://btarg.com.ar/tracker/browse.php*",
      "https://js.chddiy.xyz/torrents.php*",
      "https://ptchdbits.co/torrents.php*",
      "https://cinemageddon.net/browse.php*",
      "https://www.cinematik.net/browse.php*",
      "https://cinemaz.to/movies*",
      "https://filelist.io/browse.php*",
      "https://www.clan-sudamerica.net/invision/*",
      "https://greatposterwall.com/torrents.php*",
      "https://hdbits.org/browse.php*",
      "https://hdsky.me/torrents.php*",
      "https://hd-torrents.org/torrents.php*",
      "https://iptorrents.com/t*",
      "https://jpopsuki.eu/torrents.php*",
      "https://jptv.club/torrents*",
      "https://karagarga.in/browse.php*",
      "https://kp.m-team.cc/*",
      "https://lat-team.com/torrents*",
      "https://www.morethantv.me/torrents/browse*",
      "https://ncore.pro/torrents.php*",
      "https://newinsane.info/browse.php*",
      "https://passthepopcorn.me/torrents.php*",
      "https://passthepopcorn.me/torrents.php?type=seeding",
      "https://pterclub.com/torrents.php*",
      "https://secret-cinema.pw/torrents.php*",
      "https://tntracker.org/*",
      "https://www.torrentleech.org/torrents/browse*",
      "https://pterc.com/torrents.php*",
      "https://torrentseeds.org/torrents*",
      "https://torrentseeds.org/categories/*",
    ],
    require: [
      `https://cdn.jsdelivr.net/npm/jquery@${pkg.dependencies.jquery}/dist/jquery.min.js`,
      "https://openuserjs.org/src/libs/sizzle/GM_config.js",
    ],
    grant: [
      "GM.xmlHttpRequest",
      "GM.setValue",
      "GM.getValue",
      "GM_registerMenuCommand",
    ],
    updateURL:
      "https://github.com/Moreasan/trackers-userscripts/blob/master/Find%20Unique%20Titles/dist/find.unique.titles.user.js",
    downloadURL:
      "https://github.com/Moreasan/trackers-userscripts/blob/master/Find%20Unique%20Titles/dist/find.unique.titles.user.js",
  },
};
