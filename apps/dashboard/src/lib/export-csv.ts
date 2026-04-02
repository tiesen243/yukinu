export function exportCsv(filename: string, data: unknown[]) {
  const csvContent = [
    Object.keys(data[0] as Record<string, unknown>).join(','),
    ...data.map((row) =>
      Object.values(row as Record<string, unknown>)
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(','),
    ),
  ].join('\n')

  const encodedUri = `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `${filename}_${new Date().toISOString()}.csv`)
  document.body.append(link)
  link.click()
  link.remove()
}
