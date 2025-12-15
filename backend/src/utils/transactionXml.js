import { create } from 'xmlbuilder2';

// PACS.008
export function generateTransactionXml(transaction) {
  const {
    transactionId,
    senderId,
    fromIban,
    toIban,
    amount,
    currency,
    date,
    description,
    senderName,
    recipientName
  } = transaction;

  const xmlObj = {
    Document: {
      '@xmlns': 'urn:iso:std:iso:20022:tech:xsd:pacs.008.001.02',
      FIToFICustomerCreditTransfer: {
        GrpHdr: {
          MsgId: transactionId,
          CreDtTm: date,
          NbOfTxs: '1',
          InitgPty: { Nm: senderName },
        },
        PmtInf: {
          PmtInfId: `${transactionId}-PMT`,
          PmtMtd: 'TRF',
          PmtTpInf: { SvcLvl: { Cd: 'SEPA' } },
          Dbtr: {
            Nm: senderName,
            Acct: { Id: { IBAN: fromIban } },
          },
          DbtrAgt: { FinInstnId: { BIC: process.env.BANK_BIC || 'BANKPLPW' } },
          CdtTrfTxInf: {
            PmtId: { TxId: transactionId },
            Amt: { InstdAmt: { '@Ccy': currency, '#': amount } },
            CdtrAgt: { FinInstnId: { BIC: process.env.BANK_BIC || process.env.BANK_BIC } },
            Cdtr: {
              Nm: recipientName ? recipientName : 'Unknown',
              Acct: { Id: { IBAN: toIban } },
            },
            RmtInf: { Ustrd: description || 'No description' },
          },
        },
      },
    },
  };

  return create({ version: '1.0', encoding: 'UTF-8' })
    .ele(xmlObj)
    .end({ prettyPrint: true });
}


export function parseXmlPacs008(xmlObject) {
    const doc = create(xmlObject);
    const obj = doc.end({format: "object"});

    const data = obj.Document.FIToFICustomerCreditTransfer;
    const transactionData = {
      transactionId: data.GrpHdr.MsgId,
      senderName: data.PmtInf.Dbtr.Nm,
      recipientName: data.PmtInf.CdtTrfTxInf.Cdtr.Nm,
      fromIban: data.PmtInf.Dbtr.Acct.Id.IBAN,
      toIban: data.PmtInf.CdtTrfTxInf.Cdtr.Acct.Id.IBAN,
      amount: data.PmtInf.CdtTrfTxInf.Amt.InstdAmt['#'],
      currency: data.PmtInf.CdtTrfTxInf.Amt.InstdAmt['@Ccy'],
      description: data.PmtInf.CdtTrfTxInf.RmtInf?.Ustrd || 'Transaction',
      date: new Date(data.GrpHdr.CreDtTm),
      status: 'pending',
    };


    return transactionData
}