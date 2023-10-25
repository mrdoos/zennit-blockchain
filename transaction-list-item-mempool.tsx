/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { getMempoolTxLabel } from './mempool-tx-label';
import { TransactionIcon } from './transaction-icon';
import { TransactionListItemContainer } from './transaction-list-item-container';
import { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';
import { Box, color, Flex, Stack, Text } from '@stacks/ui';
import { getTxTypeName } from '@stacks/ui-utils';
import { selectPoxInfo } from '@store/stacking';
import { sumStxTxTotal } from '@utils/sum-stx-tx-total';
import {
  isStackingTx,
  truncateMiddle,
  isDelegatedStackingTx,
  isDelegateStxTx,
  isRevokingDelegationTx,
} from '@utils/tx-utils';
import { toHumanReadableStx } from '@utils/unit-convert';
import React, { FC, useRef, useEffect, MutableRefObject } from 'react';
import { useSelector } from 'react-redux';
import { useHover, useFocus } from 'use-events';

const shouldShowMempoolTx = (tx: MempoolTransaction, contractId?: string) =>
  tx.tx_type === 'token_transfer' ||
  isStackingTx(tx, contractId) ||
  isDelegatedStackingTx(tx, contractId) ||
  isDelegateStxTx(tx, contractId) ||
  isRevokingDelegationTx(tx, contractId);

interface TransactionListItemMempoolProps {
  tx: MempoolTransaction;
  address: string;
  domNodeMapRef: MutableRefObject<any>;
  activeTxIdRef: MutableRefObject<string | null>;
  onSelectTx: (txId: string) => void;
}

export const TransactionListItemMempool: FC<TransactionListItemMempoolProps> = props => {
  const { tx, address, domNodeMapRef, activeTxIdRef, onSelectTx } = props;
  const [hovered, bindHover] = useHover();
  const [focused, bindFocus] = useFocus();
  const containerRef = useRef<HTMLButtonElement>(null);
  const poxInfo = useSelector(selectPoxInfo);
  const memo =
    tx.tx_type === 'token_transfer' &&
    Buffer.from(
      tx.token_transfer.memo.replace('0x', '').replace(/^(0{2})+|(0{2})+$/g, ''),
      'hex'
    ).toString('utf8');

  useEffect(() => {
    if (containerRef.current !== null && domNodeMapRef !== null) {
      domNodeMapRef.current[tx.tx_id] = containerRef.current;
    }
  }, [domNodeMapRef, tx.tx_id]);

  if (focused && activeTxIdRef !== null) {
    activeTxIdRef.current = tx.tx_id;
  }

  const isSender = tx.sender_address === address;

  if (!shouldShowMempoolTx(tx, poxInfo?.contract_id)) {
    return null;
  }

  const txDate = new Date(tx.receipt_time_iso);
  const txDateShort = txDate.toLocaleString();

  return (
    <TransactionListItemContainer
      ref={containerRef}
      onClick={() => onSelectTx(tx.tx_id)}
      data-txid={tx.tx_id}
      focused={focused}
      hovered={hovered}
      txId={tx.tx_id}
      {...bindHover}
      {...bindFocus}
    >
      <TransactionIcon variant="pending" mr="base-loose" />
      <Box flex={1}>
        <Text textStyle="body.large.medium" display="block">
          {getMempoolTxLabel(tx, address, poxInfo?.contract_id || '')}
        </Text>
        <Stack isInline spacing="tight">
          <Text textStyle="body.small" color={color('text-caption')}>
            {getTxTypeName(tx as any)}
          </Text>
          <Text textStyle="body.small" color={color('text-caption')}>
            {txDateShort}
          </Text>
          <Text textStyle="body.small" color={color('text-caption')}>
            {tx.tx_type === 'token_transfer'
              ? isSender
                ? `To ${truncateMiddle(tx.token_transfer.recipient_address)}`
                : `From ${truncateMiddle(tx.sender_address)}`
              : null}
          </Text>
        </Stack>
      </Box>
      <Box textAlign="right">
        <Flex alignItems="center">
          <Text color={color('feedback-alert')} fontSize={0} mr="tight" fontWeight="500">
            Pending
          </Text>
          <Text textStyle="body.large" color={color('text-title')} display="block">
            {isSender ? '-' : ''}
            {toHumanReadableStx(sumStxTxTotal(address, tx as any).toString())}
          </Text>
        </Flex>
        <Text textStyle="body.small" color={color('text-caption')}>
          {memo}
        </Text>
      </Box>
    </TransactionListItemContainer>
  );
};
