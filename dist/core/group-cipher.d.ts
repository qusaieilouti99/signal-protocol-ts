import { SenderKey } from './session-types';
import { LoggerType, SignalProtocolGroupAddressType, StorageType } from './types';
export declare class GroupCipher {
    address: SignalProtocolGroupAddressType;
    storage: StorageType;
    logger: LoggerType;
    constructor(storage: StorageType, address: SignalProtocolGroupAddressType, logger: LoggerType);
    encrypt(buffer: ArrayBuffer): Promise<{
        cipherText: string;
        senderKeyVersion: number;
    }>;
    createSenderSession(version: number): Promise<SenderKey<string>>;
    createOrUpdateReceiverSession(senderKey: SenderKey): Promise<void>;
    resetSenderSession(version: number): Promise<SenderKey<string>>;
    decrypt(buff: string | ArrayBuffer, encoding?: string, textId?: string): Promise<ArrayBuffer>;
    private encryptJob;
    private decryptJob;
    private prepareChain;
    private fillMessageKeys;
    private generateGroupSenderKey;
    private createSenderSessionJob;
    private resetSenderSessionJob;
    private createOrUpdateReceiverSessionJob;
    private getSession;
}
