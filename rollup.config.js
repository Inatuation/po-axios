import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";

export default {
    input: "src/index.ts",
    output: {
        file: "dist/index.js",
        format: "cjs",
    },
    external: ["axios"],
    plugins: [
        resolve(),
        commonjs(),
        typescript({
            declaration: true, // 或者其他需要的 TypeScript 配置
            declarationDir: "dist/types", // 添加这一行来指定类型声明文件的输出目录
        }),
        babel({
            babelHelpers: "bundled", // 使用内联助手函数，避免外部依赖
            presets: ["@babel/preset-env"], // 配置 Babel 来转换你的代码
            exclude: "node_modules/**", // 排除 node_modules 目录下的文件
        }),
    ],
};
