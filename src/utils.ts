import {
  Client,
  ClientFactory,
  DefaultProviderUrls,
  EOperationStatus,
  IAccount,
  MAINNET_CHAIN_ID
} from '@massalabs/massa-web3'

export const awaitFinalization = async (
  client: Client,
  txId: string
): Promise<void> => {
  await client
    .smartContracts()
    .awaitRequiredOperationStatus(txId, EOperationStatus.SPECULATIVE_SUCCESS)
    .then((status) => {
      if (status == EOperationStatus.SPECULATIVE_SUCCESS) {
        return true;
      }else{
        return false;
      }
    })
}

export const logEvents = (client: Client, txId: string): void => {
  client
    .smartContracts()
    .getFilteredScOutputEvents({
      emitter_address: null,
      start: null,
      end: null,
      original_caller_address: null,
      is_final: null,
      original_operation_id: txId
    })
    .then((r) => r.forEach((e) => console.log(e.data)))
}

export const createClient = (baseAccount?: IAccount) =>
  ClientFactory.createDefaultClient(
    DefaultProviderUrls.MAINNET,
    MAINNET_CHAIN_ID,
    true,
    baseAccount
  )