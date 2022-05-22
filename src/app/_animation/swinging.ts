import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

export const swingingFromSide = trigger('swingingFromSide', [
  transition(
    ':leave',
    animate(
      400,
      style({
        opacity: 0,
        transform: 'rotateY(-90deg)',
        transition: 'all 0.5s cubic-bezier(.36,-0.64,.34,1.76)',
      })
    )
  ),
]);
