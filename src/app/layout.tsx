import ClientLayout from '@/components/ClientLayout'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="h-full">
      <body className="h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}