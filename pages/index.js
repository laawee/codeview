import dynamic from 'next/dynamic'

const ReactPreview = dynamic(() => import('../components/ReactPreview'), { ssr: false })

export default function Home() {
  return (
    <div>
      <ReactPreview />
    </div>
  )
}
