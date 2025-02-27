/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from 'react';
import { Transition } from 'react-transition-group';
import SvgCloseSmall from '@itwin/itwinui-icons-react/cjs/icons/CloseSmall';
import SvgStatusErrorHollow from '@itwin/itwinui-icons-react/cjs/icons/StatusErrorHollow';
import SvgInfoCircularHollow from '@itwin/itwinui-icons-react/cjs/icons/InfoCircularHollow';
import SvgStatusSuccessHollow from '@itwin/itwinui-icons-react/cjs/icons/StatusSuccessHollow';
import cx from 'classnames';
import { useTheme } from '../utils/hooks/useTheme';
import '@itwin/itwinui-css/css/toast-notification.css';
import { IconButton } from '../Buttons';
import { getWindow } from '../utils/common';

export type ToastCategory = 'informational' | 'negative' | 'positive';

export type ToastProps = {
  /**
   * Internal id of the toast. Used for closing the toasts.
   */
  id: number;
  /**
   * Content of the Toast message
   */
  content: React.ReactNode;
  /**
   * Category of the Toast, which controls the border color, as well as the category icon.
   */
  category: ToastCategory;
  /**
   * The Type of the Toast.
   * Persisting Toasts will not be closed automatically, and will contain a close button.
   * Temporary Toasts will automatically close after 7 seconds and will not contain a close button.
   * @default 'temporary'
   */
  type?: 'persisting' | 'temporary';
  /**
   * Boolean indicating when the toast is visible.
   * When false, will close the Toast and call onRemove when finished closing.
   */
  isVisible: boolean;
  /**
   * Duration of the toast in millisecond.
   * @default 7000
   */
  duration?: number;
  /**
   * Boolean indicating when the close button is visible.
   * When false, the toast will not have any close button.
   */
  hasCloseButton?: boolean;
  /**
   * A Callback that can be used to add additional information to a Toast
   */
  link?: { onClick: () => void; title: string };
  /**
   * Function called when the toast is all the way closed.
   */
  onRemove?: () => void;
};

/**
 * Generic Toast Notification Component
 * @example
 * <Toast type='persisting' content='Job processing completed.' category='positive' link={{onClick:() => {alert('Link callback')}, title:'View the report'}} />
 * <Toast type='temporary' content='Processing completed.' category='positive' />
 * <Toast type='temporary' content='26 files are available for synchronization.' category='informational' />
 * <Toast type='persisting' content='Job processing error.' category='negative' />
 */
export const Toast = (props: ToastProps) => {
  const {
    content,
    category,
    type = 'temporary',
    isVisible,
    link,
    duration = 7000,
    hasCloseButton,
    onRemove,
  } = props;

  useTheme();

  const closeTimeout = React.useRef(0);

  const [visible, setVisible] = React.useState(isVisible);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    if (type === 'temporary') {
      setCloseTimeout(duration);
    }

    return () => {
      clearCloseTimeout();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, type]);

  React.useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  const close = () => {
    clearCloseTimeout();
    setVisible(false);
  };

  const setCloseTimeout = (timeout: number) => {
    const definedWindow = getWindow();
    if (!definedWindow) {
      return;
    }

    closeTimeout.current = definedWindow.setTimeout(() => {
      close();
    }, timeout);
  };

  const clearCloseTimeout = () => {
    getWindow()?.clearTimeout(closeTimeout.current);
  };

  const getCategoryIcon = React.useCallback(() => {
    switch (category) {
      case 'positive':
        return <SvgStatusSuccessHollow className='iui-icon' aria-hidden />;
      case 'informational':
        return <SvgInfoCircularHollow className='iui-icon' aria-hidden />;
      case 'negative':
      default:
        return <SvgStatusErrorHollow className='iui-icon' aria-hidden />;
    }
  }, [category]);

  const onRef = (ref: HTMLDivElement) => {
    if (ref) {
      const { height } = ref.getBoundingClientRect();
      setHeight(height);
    }
  };

  return (
    <Transition
      timeout={{ enter: 240, exit: 120 }}
      in={visible}
      appear={true}
      unmountOnExit={true}
      onExited={onRemove}
    >
      {(state) => (
        <div
          className={cx('iui-toast-all', `iui-toast-${state}`)}
          style={{
            height,
            marginBottom: visible ? '0' : -height,
          }}
        >
          <div ref={onRef}>
            <div className={`iui-toast iui-${category}`}>
              <div className='iui-status-area'>{getCategoryIcon()}</div>
              <div className='iui-message'>{content}</div>
              {link && (
                <a className='iui-anchor' onClick={link.onClick}>
                  {link.title}
                </a>
              )}
              {(type === 'persisting' || hasCloseButton) && (
                <IconButton
                  size='small'
                  styleType='borderless'
                  onClick={close}
                  aria-label='Close'
                >
                  <SvgCloseSmall />
                </IconButton>
              )}
            </div>
          </div>
        </div>
      )}
    </Transition>
  );
};

export default Toast;
