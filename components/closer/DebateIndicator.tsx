export default function DebateIndicator() {
  return (
    <div className="flex items-center justify-center gap-2 py-2 px-4">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 animate-pulse">
        <span className="font-medium text-purple-400">Claude</span>
        <span>·</span>
        <span className="font-medium text-blue-400">Gemini</span>
        <span>·</span>
        <span className="font-medium text-green-400">GPT</span>
        <span className="ml-1">analizando...</span>
      </div>
    </div>
  );
}
