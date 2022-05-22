export function makeDeletedObj(formGroup: any) {
  let deleted;
  const keyId = formGroup.get('KeyId')?.value;
  if (keyId) {
    const model = formGroup.get('Model')?.value;
    deleted = {
      KeyId: keyId,
      Model: model,
      RecordStatus: 'Deleted',
      Criteria: null,
    };
  }

  return deleted;
}
