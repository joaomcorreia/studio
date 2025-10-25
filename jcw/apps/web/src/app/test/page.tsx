export default function TestPage() {
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue' }}>
      <h1 style={{ color: 'red', fontSize: '24px' }}>🎉 TEST PAGE WORKING!</h1>
      <p style={{ color: 'black', fontSize: '16px' }}>
        If you can see this styled text, React is working but Tailwind CSS might not be loading.
      </p>
      <div>
        <p>Testing Tailwind classes:</p>
        <div className="bg-red-500 text-white p-4 rounded">
          This should be red with white text if Tailwind is working
        </div>
      </div>
    </div>
  )
}