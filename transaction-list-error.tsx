import { templateTxBoxProps } from './transaction-list-item-pseudo';
import { Text, Flex, BoxProps, color } from '@stacks/ui';
import { StacksNode } from '@store/stacks-node';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

const linkProps: BoxProps = {
  color: 'blue',
  textStyle: 'caption.medium',
  fontSize: '12px',
  lineHeight: '22px',
  cursor: 'pointer',
};

interface TransactionListErrorProps {
  node: StacksNode;
  error: string;
}

export const TransactionListError: FC<TransactionListErrorProps> = ({ node, error }) => {
  const usingPbcHostedNode = node.id === 'default';
  return (
    <Flex {...templateTxBoxProps}>
      <Text textStyle="body.small" display="block" textAlign="center" mb="tight">
        {error}
      </Text>
      <Text
        textStyle="caption"
        color={color('text-caption')}
        textAlign="center"
        mx="base"
        lineHeight="20px"
      >
        {usingPbcHostedNode && <>Unable to connect to the Hiro Systems hosted node.</>}
        {!usingPbcHostedNode && (
          <>
            Make sure you&apos;re connecting to a working Stacks Node
            <br />
            You&apos;re currently using {node.url}
            <br />
            <Link to="/settings">
              <Text {...linkProps}>Check your Stacks Node settings.</Text>
            </Link>
          </>
        )}
      </Text>
    </Flex>
  );
};
