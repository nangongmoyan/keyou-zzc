import {init, Direction} from '@keyou-zzc/screen-adaption';
import {normalization} from '@keyou-zzc/headless';

normalization(['ios', 'android']);

init({
  designSize: {
    width: 375,
    height: 675,
  },
  direction: Direction.width,
});
