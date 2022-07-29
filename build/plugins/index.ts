import type { ConfigEnv, PluginOption } from 'vite';
import vue from './vue';
import html from './html';
import autoImport from './auto-import';
import windicss from './windicss';
import visualizer from './visualizer';

/**
 *	vite插件
 * @param configEnv - 环境
 * @param srcPath - src路径
 * @param viteEnv - 环境变量配置
 */
export function setupVitePlugins(
  configEnv: ConfigEnv,
  srcPath: string,
  viteEnv: ImportMetaEnv
): (PluginOption | PluginOption[])[] {
  const plugins = [vue, html(configEnv), ...autoImport(), windicss];

  if (configEnv.command === 'build' && viteEnv.VITE_VISUALIZER === 'true') {
    plugins.push(visualizer);
  }

  return plugins;
}
