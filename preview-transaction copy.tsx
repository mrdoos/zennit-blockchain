import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { Flex, Text, Box, color } from '@stacks/ui';
import { toHumanReadableStx } from '@utils/unit-convert';
import React, { FC } from 'react';

export const TxModalPreview: FC = ({ children }) => (
  <Flex flexDirection="column" fontSize="14px" mx="extra-loose" mt="tight">
    {children}
  </Flex>
);

interface TxModalPreviewItemProps {
  label: string;
}

export const TxModalPreviewItem: FC<TxModalPreviewItemProps> = ({ label, children }) => (
  <Flex alignItems="center" height="64px" borderBottom={`1px solid ${color('border')}`}>
    <Text textStyle="body.small.medium" width="70px">
      {label}
    </Text>
    <Text>{children}</Text>
  </Flex>
);

interface PreviewTransactionProps {
  recipient: string;
  amount: string;
  total: string;
  fee: string;
  nonce: number;
  memo?: string;
  totalExceedsBalance: boolean;
}

export const PreviewTransaction: FC<PreviewTransactionProps> = props => {
  const { recipient, amount, total, fee, memo, nonce, totalExceedsBalance } = props;

  return (
    <TxModalPreview>
      <TxModalPreviewItem label="To">
        <Text fontSize="13px">{recipient}</Text>
      </TxModalPreviewItem>
      <TxModalPreviewItem label="Amount">{toHumanReadableStx(amount)}</TxModalPreviewItem>
      <TxModalPreviewItem label="Fee">{toHumanReadableStx(fee)}</TxModalPreviewItem>
      <TxModalPreviewItem label="Total">{toHumanReadableStx(total)}</TxModalPreviewItem>
      <TxModalPreviewItem label="Nonce">{nonce}</TxModalPreviewItem>
      {memo && <TxModalPreviewItem label="Memo">{memo}</TxModalPreviewItem>}
      <Box minHeight="24px">
        {totalExceedsBalance && (
          <ErrorLabel size="md" my="base-loose">
            <ErrorText fontSize="14px" lineHeight="20px">
              You have insufficient balance to complete this transfer.
            </ErrorText>
          </ErrorLabel>
        )}
      </Box>
    </TxModalPreview>
  );
};
