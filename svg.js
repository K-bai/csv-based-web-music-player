import fs from "fs";
import { optimize } from "svgo";

//TODO: remove this once https://github.com/vitejs/vite/pull/2909 gets merged
export const svgLoader = (options) => {
  // these options will always be overridden
  const overrideOptions = {
    svgo: {
      // set multipass to allow all optimizations
      multipass: true,
      // setting datauri to undefined will get pure svg
      // since we want to encode with mini-svg-data-uri
      datauri: "enc",
    },
  };
  options = options ?? overrideOptions;
  options.svgo = Object.assign(options.svgo ?? {}, overrideOptions.svgo);
  return {
    name: "vite-svg-patch-plugin",
    transform: function (code, id) {
      if (id.endsWith(".svg")) {
        const extractedSvg = fs.readFileSync(id, "utf8");
        const optimized = optimize(extractedSvg, options?.svgo).data;
        return `export default "${optimized}"`;
      }
      return code;
    },
  };
};
