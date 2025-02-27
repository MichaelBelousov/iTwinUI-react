/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import SvgCloseSmall from '@itwin/itwinui-icons-react/cjs/icons/CloseSmall';
import SvgInfoCircular from '@itwin/itwinui-icons-react/cjs/icons/InfoCircular';
import SvgStatusError from '@itwin/itwinui-icons-react/cjs/icons/StatusError';
import SvgStatusSuccess from '@itwin/itwinui-icons-react/cjs/icons/StatusSuccess';
import SvgStatusWarning from '@itwin/itwinui-icons-react/cjs/icons/StatusWarning';
import cx from 'classnames';
import React from 'react';
import { CommonProps } from '../utils/props';
import { useTheme } from '../utils/hooks/useTheme';
import '@itwin/itwinui-css/css/alert.css';
import { IconButton } from '../Buttons/IconButton';

export type AlertProps = {
  /**
   * Type of the alert.
   * @default 'informational'
   */
  type?: 'positive' | 'warning' | 'negative' | 'informational';
  /**
   * Text for the link you want to provide.
   */
  clickableText?: React.ReactNode;
  /**
   * Action handler for the clickable text.
   */
  onClick?: () => void;
  /**
   * Action handler for close.
   */
  onClose?: () => void;
  /**
   * Stick the alert to the top.
   * @default false
   */
  isSticky?: boolean;
  /**
   * Alert message text.
   */
  children: React.ReactNode;
} & Omit<CommonProps, 'title'>;

/**
 * A small box to quickly grab user attention and communicate a brief message
 * @example
 * <Alert>This is a basic alert.</Alert>
 * <Alert type='positive'>This is a positive alert.</Alert>
 * <Alert type='warning'>This is a warning alert.</Alert>
 * <Alert type='negative'>This is a negative alert.</Alert>
 * <Alert type='positive' clickableText="I am a clickable text" onClick={()=>alert("Pressed")}>This is a positive alert with a clickable text</Alert>
 */
export const Alert = (props: AlertProps) => {
  const {
    children,
    className,
    type = 'informational',
    clickableText,
    onClick,
    onClose,
    style,
    isSticky = false,
    ...rest
  } = props;

  useTheme();

  const iconMap = {
    negative: <SvgStatusError className='iui-icon' aria-hidden />,
    informational: <SvgInfoCircular className='iui-icon' aria-hidden />,
    positive: <SvgStatusSuccess className='iui-icon' aria-hidden />,
    warning: <SvgStatusWarning className='iui-icon' aria-hidden />,
  };

  return (
    <div
      className={cx(
        'iui-alert',
        `iui-${type}`,
        { 'iui-sticky': isSticky },
        className,
      )}
      style={style}
      {...rest}
    >
      {iconMap[type]}
      <span className='iui-message'>
        {children}
        {clickableText && (
          <a style={{ cursor: 'pointer' }} onClick={onClick}>
            {clickableText}
          </a>
        )}
      </span>

      {onClose && (
        <IconButton
          styleType='borderless'
          size='small'
          onClick={onClose}
          aria-label='Close'
        >
          <SvgCloseSmall aria-hidden />
        </IconButton>
      )}
    </div>
  );
};

export default Alert;
