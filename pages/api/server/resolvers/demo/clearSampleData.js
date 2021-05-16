export const clearSampleData = async (demoTokenId, prisma) => {
  const deleteData = prisma.demoToken.update({
    where: {
      id: demoTokenId
    },
    data: {
      habits: { deleteMany: {} },
      entries: { deleteMany: {} },
      records: { deleteMany: {} }
    }
  });
  const deleteToken = prisma.demoToken.delete({
    where: {
      id: demoTokenId
    }
  });
  const deleteEverything = [deleteData, deleteToken];
  const settingsToDelete = await prisma.settings.findUnique({ where: { demoTokenId } });
  if (settingsToDelete) {
    const deleteSettings = prisma.settings.delete({ where: { demoTokenId } });
    deleteEverything.splice(1, deleteSettings);
  }
  return prisma.$transaction(deleteEverything);
}