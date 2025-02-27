/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { action } from '@storybook/addon-actions';
import { useEffect, useState } from '@storybook/addons';
import { Meta, Story } from '@storybook/react';
import React from 'react';
import { ExpandableBlock } from '../../src/core';
import { ExpandableBlockProps } from '../../src/core/ExpandableBlock/ExpandableBlock';

export default {
  title: 'Core/ExpandableBlock',
  component: ExpandableBlock,
  argTypes: {
    onToggle: {
      action: 'isExpanding',
    },
    style: { control: { disable: true } },
    className: { control: { disable: true } },
  },
  args: {
    children: 'Content in block!',
  },
} as Meta<ExpandableBlockProps>;

export const Basic: Story<ExpandableBlockProps> = (args) => {
  return (
    <ExpandableBlock title='Basic Block' {...args}>
      {args.children}
    </ExpandableBlock>
  );
};

Basic.argTypes = {
  title: { defaultValue: 'Basic Block' },
  isExpanded: { defaultValue: false },
};

export const WithCaption: Story<ExpandableBlockProps> = (args) => {
  return (
    <ExpandableBlock title='Basic Block' caption='basic caption' {...args}>
      {args.children}
    </ExpandableBlock>
  );
};

WithCaption.argTypes = {
  title: { defaultValue: 'Basic Block' },
  isExpanded: { defaultValue: false },
  caption: { defaultValue: 'basic caption' },
};

export const Accordion: Story<ExpandableBlockProps> = (args) => {
  const [openedBlock, setOpenedBlock] = useState<number | undefined>(undefined);
  const toggleHandler = (isExpanding: boolean, id: number) => {
    action(`isExpanding: ${isExpanding}, id: ${id}`, {
      clearOnStoryChange: false,
    })();
    if (isExpanding) {
      setOpenedBlock(id);
    } else {
      setOpenedBlock(undefined);
    }
  };

  useEffect(() => {
    return () => action('', { clearOnStoryChange: true })();
  }, []);

  return (
    <>
      {[...new Array(3)].map((_, index) => (
        <ExpandableBlock
          key={index}
          title={`Basic Block #${index + 1}`}
          isExpanded={openedBlock === index}
          onToggle={(isExpanding) => toggleHandler(isExpanding, index)}
          caption={args.caption}
        >
          {args.children}
        </ExpandableBlock>
      ))}
    </>
  );
};

Accordion.argTypes = {
  title: { control: { disable: true } },
  isExpanded: { control: { disable: true } },
  onToggle: { control: { disable: true } },
};
