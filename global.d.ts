import 'jquery';
import Popper from 'popper.js';
import * as Feather from 'feather-icons';
import { Chart as ChartConstructor } from 'chart.js';
import electron from 'electron';

declare global {
  interface Window {
    $: JQueryStatic;
    jQuery: JQueryStatic;
    Popper: typeof Popper;
    feather: typeof Feather;
    Chart: typeof Chart;
  }

  interface Event {
    message?: any;
  }

  const feather: typeof Feather;
  const Chart: typeof ChartConstructor;

  interface NodeModule {
    hot: any;
  }
}

declare module 'react-router-redux' {
  function syncHistoryWithStore(history, store): any;
}
