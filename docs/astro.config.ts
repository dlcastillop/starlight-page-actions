import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightPageActions from "starlight-page-actions";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { normalizePath } from "vite";

export default defineConfig({
  integrations: [
    starlight({
      editLink: {
        baseUrl:
          "https://github.com/dlcastillop/starlight-page-actions/edit/main/docs/",
      },
      plugins: [starlightPageActions()],
      sidebar: [
        {
          label: "Start Here",
          items: ["getting-started"],
        },
      ],
      social: [
        {
          href: "https://github.com/dlcastillop/starlight-page-actions",
          icon: "github",
          label: "GitHub",
        },
      ],
      title: "starlight-page-actions",
    }),
  ],
  vite: {
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: "src/content/docs/**/*.{md,mdx}",
            dest: "",
            rename: (
              fileName: string,
              fileExtension: string,
              fullPath: string
            ) => {
              const fullPathNormalized = normalizePath(fullPath);
              const relativePath = (
                fullPathNormalized.split("src/content/docs/")[1] as string
              ).replace(new RegExp(`\\.${fileExtension}$`), "");
              const pathSegments = relativePath.split("/");

              if (fileName === "index") {
                if (pathSegments.length === 1) {
                  return "index.md";
                } else {
                  const directories = pathSegments.slice(0, -2).join("/");
                  const folderName = pathSegments[pathSegments.length - 2];

                  return directories
                    ? `${directories}/${folderName}.md`
                    : `${folderName}.md`;
                }
              }

              const directories = pathSegments.slice(0, -1).join("/");
              const finalPath = directories
                ? `${directories}/${fileName}.md`
                : `${fileName}.md`;

              return finalPath;
            },
          },
        ],
      }),
    ],
  },
});
