const Loader = ({ fullScreen = false, text = "Loading..." }) => {
  return (
    <div
      className={
        fullScreen
          ? "fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 bg-slate-950/70 backdrop-blur-sm"
          : "flex flex-col items-center justify-center gap-3 py-10"
      }
    >
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />
        <div className="absolute inset-0 animate-ping rounded-full border-4 border-transparent border-t-purple-500/40" />
      </div>
      {text && <p className="text-sm font-medium text-slate-400">{text}</p>}
    </div>
  )
}

export default Loader