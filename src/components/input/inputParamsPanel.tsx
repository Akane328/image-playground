import type { ApiProfile, NovelaiCharacter, TaskParams } from '../../types'
import { dismissAllTooltips } from '../../lib/tooltipDismiss'
import Select from '../Select'
import ButtonTooltip from './buttonTooltip'

interface HintTooltipState {
  visible: boolean
  show: () => void
  hide: () => void
  clearTimer: () => void
  startTouch: () => void
}

export default function InputParamsPanel({
  cols,
  params,
  setParams,
  activeProfile,
  isFalProvider,
  isNovelaiProvider,
  isOfficialNovelaiProvider,
  isFalTextToImage,
  displaySize,
  qualityOptions,
  selectClass,
  transparentOutputAvailable,
  showTransparentOutputControl,
  transparentOutputEnabled,
  transparentOutputHint,
  onTransparentOutputMenuOpenChange,
  compressionHint,
  compressionDisabled,
  outputCompressionInput,
  setOutputCompressionInput,
  commitOutputCompression,
  moderationHint,
  moderationDisabled,
  agentAutoImageCount,
  outputImageLimit,
  nInput,
  setNInputFocused,
  commitN,
  handleNInputChange,
  handleNLimitIncreaseAttempt,
  showAgentNHint,
  hideNLimitHint,
  startAgentNHintTouch,
  clearAgentNHintTouchTimer,
  nLimitHint,
  nLimitHintText,
  streamConcurrentByN,
  streamConcurrentHint,
  sizeHint,
  qualityHint,
  onOpenSizePicker,
  onSetNovelaiCharacters,
}: {
  cols: string
  params: TaskParams
  setParams: (patch: Partial<TaskParams>) => void
  activeProfile: ApiProfile
  isFalProvider: boolean
  isNovelaiProvider: boolean
  isOfficialNovelaiProvider: boolean
  isFalTextToImage: boolean
  displaySize: string
  qualityOptions: Array<{ label: string; value: string }>
  selectClass: string
  transparentOutputAvailable: boolean
  showTransparentOutputControl: boolean
  transparentOutputEnabled: boolean
  transparentOutputHint: HintTooltipState
  onTransparentOutputMenuOpenChange: (open: boolean) => void
  compressionHint: HintTooltipState
  compressionDisabled: boolean
  outputCompressionInput: string
  setOutputCompressionInput: (value: string) => void
  commitOutputCompression: () => void
  moderationHint: HintTooltipState
  moderationDisabled: boolean
  agentAutoImageCount: boolean
  outputImageLimit: number
  nInput: string
  setNInputFocused: (focused: boolean) => void
  commitN: () => void
  handleNInputChange: (value: string) => void
  handleNLimitIncreaseAttempt: (preventDefault: () => void) => void
  showAgentNHint: () => void
  hideNLimitHint: () => void
  startAgentNHintTouch: () => void
  clearAgentNHintTouchTimer: () => void
  nLimitHint: HintTooltipState
  nLimitHintText: string
  streamConcurrentByN: boolean
  streamConcurrentHint: HintTooltipState
  sizeHint: HintTooltipState
  qualityHint: HintTooltipState
  onOpenSizePicker: () => void
  onSetNovelaiCharacters: (characters: NovelaiCharacter[]) => void
}) {
  return (
    <div className={`grid ${cols} gap-2 text-xs flex-1`}>
      <label
        className="relative flex flex-col gap-0.5"
        onMouseEnter={sizeHint.show}
        onMouseLeave={sizeHint.hide}
        onTouchStart={sizeHint.startTouch}
        onTouchEnd={sizeHint.clearTimer}
        onTouchCancel={sizeHint.hide}
        onClick={sizeHint.show}
      >
        <span className="text-gray-400 dark:text-gray-500 ml-1">尺寸</span>
        <button
          type="button"
          onClick={() => { dismissAllTooltips(); onOpenSizePicker() }}
          className="px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.03] hover:bg-white dark:hover:bg-white/[0.06] focus:outline-none text-xs text-left transition-all duration-200 shadow-sm font-mono"
        >
          {displaySize}
        </button>
        <ButtonTooltip
          visible={(isFalTextToImage || activeProfile.codexCli) && sizeHint.visible}
          text={isFalTextToImage
            ? <>fal.ai 的文生图模式不支持 <code className="rounded bg-white/10 px-1 py-0.5 font-mono">auto</code> 参数</>
            : 'Codex CLI 不支持尺寸参数，此处设置仅基于提示词工程'}
        />
      </label>
      {isOfficialNovelaiProvider && (
        <label className="col-span-full flex flex-col gap-0.5">
          <span className="text-gray-400 dark:text-gray-500 ml-1">生成模式</span>
          <Select
            value={params.novelai_generation_mode}
            onChange={(val) => setParams({
              novelai_generation_mode: val as TaskParams['novelai_generation_mode'],
              ...(val !== 'generate'
                ? { novelai_enable_reference: false, novelai_enable_character_reference: false, novelai_enable_inline_upscale: false }
                : {}),
            })}
            options={[
              { label: '文生图', value: 'generate' },
              { label: '图生图', value: 'img2img' },
              { label: '局部重绘', value: 'infill' },
            ]}
            showValueTooltips={false}
            className={selectClass}
          />
          {params.novelai_generation_mode !== 'generate' && (
            <span className="mt-1 text-[11px] leading-5 text-gray-400 dark:text-gray-500">
              {params.novelai_generation_mode === 'infill' ? '请先上传参考图并创建遮罩' : '请先上传参考图'}
            </span>
          )}
        </label>
      )}
      {isOfficialNovelaiProvider && params.novelai_generation_mode !== 'generate' && (
        <>
          <label className="flex flex-col gap-0.5">
            <span className="text-gray-400 dark:text-gray-500 ml-1">图像强度</span>
            <input
              type="number"
              min={0}
              max={1}
              step={0.05}
              value={params.novelai_img2img_strength}
              onChange={(e) => setParams({ novelai_img2img_strength: Math.min(1, Math.max(0, Number(e.target.value) || 0)) })}
              className="px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.03] focus:outline-none text-xs transition-all duration-200 shadow-sm"
            />
          </label>
          <label className="flex flex-col gap-0.5">
            <span className="text-gray-400 dark:text-gray-500 ml-1">图像噪声</span>
            <input
              type="number"
              min={0}
              max={1}
              step={0.05}
              value={params.novelai_img2img_noise}
              onChange={(e) => setParams({ novelai_img2img_noise: Math.min(1, Math.max(0, Number(e.target.value) || 0)) })}
              className="px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.03] focus:outline-none text-xs transition-all duration-200 shadow-sm"
            />
          </label>
          <label className="flex flex-col gap-0.5">
            <span className="text-gray-400 dark:text-gray-500 ml-1">颜色校正</span>
            <Select
              value={params.novelai_img2img_color_correct ? 'on' : 'off'}
              onChange={(val) => setParams({ novelai_img2img_color_correct: val === 'on' })}
              options={[{ label: 'true', value: 'on' }, { label: 'false', value: 'off' }]}
              showValueTooltips={false}
              className={selectClass}
            />
          </label>
        </>
      )}
      {isOfficialNovelaiProvider && params.novelai_generation_mode === 'generate' && (
        <div className="col-span-full flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="ml-1 text-gray-400 dark:text-gray-500">多角色控制</span>
            <button
              type="button"
              onClick={() => onSetNovelaiCharacters([...params.novelai_characters, { prompt: '', negative_prompt: '', position: 'C3' }])}
              className="rounded-lg px-2 py-1 text-[11px] text-blue-500 transition-colors hover:bg-blue-50 dark:hover:bg-blue-500/10"
            >
              添加角色
            </button>
          </div>
          {params.novelai_characters.map((character, index) => (
            <div key={`${index}-${character.position}`} className="rounded-xl border border-gray-200/60 bg-white/40 p-2 dark:border-white/[0.08] dark:bg-white/[0.02]">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">角色 {index + 1}</span>
                <button
                  type="button"
                  onClick={() => onSetNovelaiCharacters(params.novelai_characters.filter((_, itemIndex) => itemIndex !== index))}
                  className="rounded-lg px-2 py-1 text-[11px] text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  删除
                </button>
              </div>
              <div className="grid gap-2 sm:grid-cols-[1fr_1fr_92px]">
                <textarea
                  value={character.prompt}
                  onChange={(e) => onSetNovelaiCharacters(params.novelai_characters.map((item, itemIndex) => itemIndex === index ? { ...item, prompt: e.target.value } : item))}
                  rows={2}
                  placeholder="角色正面提示词"
                  className="min-h-16 resize-y rounded-xl border border-gray-200/60 bg-white/50 px-3 py-2 text-xs leading-5 outline-none focus:ring-1 focus:ring-blue-300/40 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-100"
                />
                <textarea
                  value={character.negative_prompt}
                  onChange={(e) => onSetNovelaiCharacters(params.novelai_characters.map((item, itemIndex) => itemIndex === index ? { ...item, negative_prompt: e.target.value } : item))}
                  rows={2}
                  placeholder="角色负面提示词"
                  className="min-h-16 resize-y rounded-xl border border-gray-200/60 bg-white/50 px-3 py-2 text-xs leading-5 outline-none focus:ring-1 focus:ring-blue-300/40 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-gray-100"
                />
                <Select
                  value={character.position}
                  onChange={(value) => onSetNovelaiCharacters(params.novelai_characters.map((item, itemIndex) => itemIndex === index ? { ...item, position: value } : item))}
                  options={['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5', 'C1', 'C2', 'C3', 'C4', 'C5', 'D1', 'D2', 'D3', 'D4', 'D5', 'E1', 'E2', 'E3', 'E4', 'E5'].map((value) => ({ label: value, value }))}
                  showValueTooltips={false}
                  className={selectClass}
                />
              </div>
            </div>
          ))}
          {!params.novelai_characters.length && <span className="ml-1 text-[11px] leading-5 text-gray-400 dark:text-gray-500">可为每个角色分别设置正面提示词、负面提示词和 A1 到 E5 的位置。</span>}
        </div>
      )}
      {isOfficialNovelaiProvider && params.novelai_generation_mode === 'generate' && (
        <label className="col-span-full flex flex-col gap-0.5">
          <span className="text-gray-400 dark:text-gray-500 ml-1">参考模式</span>
          <div className="grid grid-cols-3 gap-1 rounded-2xl border border-gray-200/60 bg-white/50 p-1 dark:border-white/[0.08] dark:bg-white/[0.03]">
            {[
              { label: '关闭', value: 'off' },
              { label: 'Vibe Transfer', value: 'vibe' },
              { label: 'Precise Reference', value: 'precise' },
            ].map((option) => {
              const checked = option.value === 'vibe' ? params.novelai_enable_reference : option.value === 'precise' ? params.novelai_enable_character_reference : !params.novelai_enable_reference && !params.novelai_enable_character_reference
              return (
                <label key={option.value} className={`flex cursor-pointer items-center justify-center rounded-xl px-2 py-2 text-center text-[11px] transition-colors ${checked ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/[0.06]'}`}>
                  <input
                    type="radio"
                    name="novelai-reference-mode"
                    value={option.value}
                    checked={checked}
                    onChange={() => setParams({ novelai_enable_reference: option.value === 'vibe', novelai_enable_character_reference: option.value === 'precise' })}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              )
            })}
          </div>
          {params.novelai_enable_reference && <span className="mt-1 text-[11px] leading-5 text-gray-400 dark:text-gray-500">先编码当前已上传图片，再将视觉氛围用于生成，支持单图或多图。</span>}
        </label>
      )}
      {isOfficialNovelaiProvider && params.novelai_generation_mode === 'generate' && params.novelai_enable_reference && (
        <>
          <label className="flex flex-col gap-0.5">
            <span className="text-gray-400 dark:text-gray-500 ml-1">参考信息提取</span>
            <input
              type="number"
              min={0}
              max={1}
              step={0.05}
              value={params.novelai_reference_information_extracted}
              onChange={(e) => setParams({ novelai_reference_information_extracted: Math.min(1, Math.max(0, Number(e.target.value) || 0)) })}
              className="px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.03] focus:outline-none text-xs transition-all duration-200 shadow-sm"
            />
          </label>
          <label className="flex flex-col gap-0.5">
            <span className="text-gray-400 dark:text-gray-500 ml-1">参考强度</span>
            <input
              type="number"
              min={0}
              max={1}
              step={0.05}
              value={params.novelai_reference_strength}
              onChange={(e) => setParams({ novelai_reference_strength: Math.min(1, Math.max(0, Number(e.target.value) || 0)) })}
              className="px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.03] focus:outline-none text-xs transition-all duration-200 shadow-sm"
            />
          </label>
        </>
      )}
      {isOfficialNovelaiProvider && params.novelai_generation_mode === 'generate' && params.novelai_enable_character_reference && (
        <>
          <label className="flex flex-col gap-0.5">
            <span className="text-gray-400 dark:text-gray-500 ml-1">角色信息提取</span>
            <input
              type="number"
              min={0}
              max={1}
              step={0.05}
              value={params.novelai_character_reference_information_extracted}
              onChange={(e) => setParams({ novelai_character_reference_information_extracted: Math.min(1, Math.max(0, Number(e.target.value) || 0)) })}
              className="px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.03] focus:outline-none text-xs transition-all duration-200 shadow-sm"
            />
          </label>
          <label className="flex flex-col gap-0.5">
            <span className="text-gray-400 dark:text-gray-500 ml-1">角色参考强度</span>
            <input
              type="number"
              min={0}
              max={1}
              step={0.05}
              value={params.novelai_character_reference_strength}
              onChange={(e) => setParams({ novelai_character_reference_strength: Math.min(1, Math.max(0, Number(e.target.value) || 0)) })}
              className="px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.03] focus:outline-none text-xs transition-all duration-200 shadow-sm"
            />
          </label>
          <label className="flex flex-col gap-0.5">
            <span className="text-gray-400 dark:text-gray-500 ml-1">角色 Fidelity</span>
            <input
              type="number"
              min={0}
              max={1}
              step={0.05}
              value={params.novelai_character_reference_fidelity}
              onChange={(e) => setParams({ novelai_character_reference_fidelity: Math.min(1, Math.max(0, Number(e.target.value) || 0)) })}
              className="px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.03] focus:outline-none text-xs transition-all duration-200 shadow-sm"
            />
          </label>
        </>
      )}
      {isOfficialNovelaiProvider && params.novelai_enable_inline_upscale && (
        <label className="flex flex-col gap-0.5">
          <span className="text-gray-400 dark:text-gray-500 ml-1">放大模糊参数</span>
          <Select
            value={String(params.novelai_upscale_blur_sigma)}
            onChange={(val) => setParams({ novelai_upscale_blur_sigma: Number(val) })}
            options={['0', '0.3', '0.35', '0.4', '0.45', '0.5'].map((value) => ({ label: value, value }))}
            showValueTooltips={false}
            className={selectClass}
          />
        </label>
      )}
      {isOfficialNovelaiProvider && params.novelai_generation_mode === 'generate' && (
        <label className="col-span-full flex flex-col gap-0.5">
          <span className="text-gray-400 dark:text-gray-500 ml-1">生成后放大增强</span>
          <Select
            value={params.novelai_enable_inline_upscale ? 'on' : 'off'}
            onChange={(val) => setParams({ novelai_enable_inline_upscale: val === 'on' })}
            options={[{ label: '关闭', value: 'off' }, { label: '开启', value: 'on' }]}
            showValueTooltips={false}
            className={selectClass}
          />
        </label>
      )}
      {(isNovelaiProvider || isOfficialNovelaiProvider) && (
        <>
          <label className="flex flex-col gap-0.5">
            <span className="text-gray-400 dark:text-gray-500 ml-1">采样器</span>
            <Select
              value={params.novelai_sampler}
              onChange={(val) => setParams({ novelai_sampler: val })}
              options={[
                { label: 'Euler Ancestral', value: 'k_euler_ancestral' },
                { label: 'Euler', value: 'k_euler' },
                { label: 'DPM++ 2S Ancestral', value: 'k_dpmpp_2s_ancestral' },
                { label: 'DPM++ 2M SDE', value: 'k_dpmpp_2m_sde' },
                { label: 'DPM++ 2M', value: 'k_dpmpp_2m' },
                { label: 'DPM++ SDE', value: 'k_dpmpp_sde' },
              ]}
              showValueTooltips={false}
              className={selectClass}
            />
          </label>
          <label className="flex flex-col gap-0.5">
            <span className="text-gray-400 dark:text-gray-500 ml-1">步数</span>
            <input
              type="number"
              min={1}
              max={100}
              value={params.novelai_steps}
              onChange={(e) => setParams({ novelai_steps: Math.min(100, Math.max(1, Number(e.target.value) || 1)) })}
              className="px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.03] focus:outline-none text-xs transition-all duration-200 shadow-sm"
            />
          </label>
          <label className="flex flex-col gap-0.5">
            <span className="text-gray-400 dark:text-gray-500 ml-1">CFG Scale</span>
            <input
              type="number"
              min={0}
              max={30}
              step={0.5}
              value={params.novelai_cfg}
              onChange={(e) => setParams({ novelai_cfg: Math.min(30, Math.max(0, Number(e.target.value) || 0)) })}
              className="px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.03] focus:outline-none text-xs transition-all duration-200 shadow-sm"
            />
          </label>
          {isOfficialNovelaiProvider && (
            <label className="flex flex-col gap-0.5">
              <span className="text-gray-400 dark:text-gray-500 ml-1">随机种子</span>
              <input
                type="number"
                value={params.novelai_seed ?? ''}
                placeholder="随机"
                onChange={(e) => setParams({ novelai_seed: e.target.value.trim() === '' ? null : Number(e.target.value) })}
                className="px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.03] focus:outline-none text-xs transition-all duration-200 shadow-sm"
              />
            </label>
          )}
          {isOfficialNovelaiProvider && (
            <label className="flex flex-col gap-0.5">
              <span className="text-gray-400 dark:text-gray-500 ml-1">UC 预设</span>
              <input
                type="number"
                min={0}
                value={params.novelai_uc_preset}
                onChange={(e) => setParams({ novelai_uc_preset: Math.max(0, Math.trunc(Number(e.target.value) || 0)) })}
                className="px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.03] focus:outline-none text-xs transition-all duration-200 shadow-sm"
              />
            </label>
          )}
          {isOfficialNovelaiProvider && (
            <label className="flex flex-col gap-0.5">
              <span className="text-gray-400 dark:text-gray-500 ml-1">CFG 重标定</span>
              <input
                type="number"
                min={0}
                max={1}
                step={0.05}
                value={params.novelai_cfg_rescale}
                onChange={(e) => setParams({ novelai_cfg_rescale: Math.min(1, Math.max(0, Number(e.target.value) || 0)) })}
                className="px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-white/[0.08] bg-white/50 dark:bg-white/[0.03] focus:outline-none text-xs transition-all duration-200 shadow-sm"
              />
            </label>
          )}
          {isOfficialNovelaiProvider && (
            <label className="flex flex-col gap-0.5">
              <span className="text-gray-400 dark:text-gray-500 ml-1">质量增强</span>
              <Select
                value={params.novelai_quality_toggle ? 'on' : 'off'}
                onChange={(val) => setParams({ novelai_quality_toggle: val === 'on' })}
                options={[{ label: 'true', value: 'on' }, { label: 'false', value: 'off' }]}
                showValueTooltips={false}
                className={selectClass}
              />
            </label>
          )}
        </>
      )}
      <label
        className="relative flex flex-col gap-0.5"
        onMouseEnter={qualityHint.show}
        onMouseLeave={qualityHint.hide}
        onTouchStart={qualityHint.startTouch}
        onTouchEnd={qualityHint.clearTimer}
        onTouchCancel={qualityHint.hide}
        onClick={qualityHint.show}
      >
        <span className="text-gray-400 dark:text-gray-500 ml-1">质量</span>
        <Select
          value={activeProfile.codexCli ? 'auto' : isFalProvider && params.quality === 'auto' ? 'high' : params.quality}
          onChange={(val) => {
            if (!activeProfile.codexCli) setParams({ quality: val as TaskParams['quality'] })
          }}
          options={qualityOptions}
          disabled={activeProfile.codexCli}
          showValueTooltips={false}
          className={activeProfile.codexCli
            ? 'px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-white/[0.08] bg-gray-100/50 dark:bg-white/[0.05] opacity-50 cursor-not-allowed text-xs transition-all duration-200 shadow-sm'
            : selectClass}
        />
        <ButtonTooltip
          visible={(activeProfile.codexCli || isFalProvider) && qualityHint.visible}
          text={isFalProvider ? <>fal.ai 不支持 <code className="rounded bg-white/10 px-1 py-0.5 font-mono">auto</code> 质量参数</> : 'Codex CLI 不支持质量参数'}
        />
      </label>
      <label className="flex flex-col gap-0.5">
        <span className="text-gray-400 dark:text-gray-500 ml-1">格式</span>
        <Select
          value={params.output_format}
          onChange={(val) => {
            setParams({
              output_format: val as TaskParams['output_format'],
              ...(val === 'png' ? { output_compression: null } : {}),
              ...(val === 'jpeg' ? { transparent_output: false } : {}),
            })
          }}
          options={[
            { label: 'PNG', value: 'png' },
            { label: 'JPEG', value: 'jpeg' },
            { label: 'WebP', value: 'webp' },
          ]}
          showValueTooltips={false}
          className={selectClass}
        />
      </label>
      {showTransparentOutputControl && (
        <label
          className="relative flex flex-col gap-0.5"
          onMouseEnter={transparentOutputHint.show}
          onMouseLeave={transparentOutputHint.hide}
          onTouchStart={transparentOutputHint.startTouch}
          onTouchEnd={transparentOutputHint.clearTimer}
          onTouchCancel={transparentOutputHint.hide}
          onClick={transparentOutputHint.show}
        >
          <span className="text-gray-400 dark:text-gray-500 ml-1">透明背景</span>
          <Select
            value={transparentOutputEnabled ? 'on' : 'off'}
            onChange={(val) => {
              if (!transparentOutputAvailable) return
              setParams({
                transparent_output: val === 'on',
                ...(params.output_format === 'png' ? { output_compression: null } : {}),
              })
            }}
            options={[
              { label: 'false', value: 'off' },
              { label: 'true', value: 'on' },
            ]}
            showValueTooltips={false}
            className={selectClass}
            onOpenChange={onTransparentOutputMenuOpenChange}
          />
          <ButtonTooltip
            visible={transparentOutputHint.visible}
            text="实现方式可在设置的 API 配置中选择"
          />
        </label>
      )}
      {!showTransparentOutputControl && (
        <label
          className="relative flex flex-col gap-0.5"
          onMouseEnter={compressionHint.show}
          onMouseLeave={compressionHint.hide}
          onTouchStart={compressionHint.startTouch}
          onTouchEnd={compressionHint.clearTimer}
          onTouchCancel={compressionHint.hide}
          onClick={compressionHint.show}
        >
          <span className="text-gray-400 dark:text-gray-500 ml-1">压缩率</span>
          <input
            value={outputCompressionInput}
            onChange={(e) => setOutputCompressionInput(e.target.value)}
            onBlur={commitOutputCompression}
            disabled={compressionDisabled}
            type="number"
            min={0}
            max={100}
            placeholder="0-100"
            className={`px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-white/[0.08] focus:outline-none text-xs transition-all duration-200 shadow-sm ${
              compressionDisabled
                ? 'bg-gray-100/50 dark:bg-white/[0.05] opacity-50 cursor-not-allowed'
                : 'bg-white/50 dark:bg-white/[0.03]'
              }`}
          />
          <ButtonTooltip
            visible={compressionHint.visible}
            text={isOfficialNovelaiProvider ? 'NovelAI 官方接口不支持压缩率参数' : isFalProvider ? 'fal.ai 不支持压缩率参数' : '仅 JPEG 和 WebP 支持压缩率'}
          />
        </label>
      )}
      <label
        className="relative flex flex-col gap-0.5"
        onMouseEnter={moderationHint.show}
        onMouseLeave={moderationHint.hide}
        onTouchStart={moderationHint.startTouch}
        onTouchEnd={moderationHint.clearTimer}
        onTouchCancel={moderationHint.hide}
        onClick={moderationHint.show}
      >
        <span className="text-gray-400 dark:text-gray-500 ml-1">审核</span>
        <Select
          value={moderationDisabled ? 'auto' : params.moderation}
          onChange={(val) => {
            if (!moderationDisabled) setParams({ moderation: val as TaskParams['moderation'] })
          }}
          options={[
            { label: 'auto', value: 'auto' },
            { label: 'low', value: 'low' },
          ]}
          disabled={moderationDisabled}
          showValueTooltips={false}
          className={moderationDisabled
            ? 'px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-white/[0.08] bg-gray-100/50 dark:bg-white/[0.05] opacity-50 cursor-not-allowed text-xs transition-all duration-200 shadow-sm'
            : selectClass}
        />
        <ButtonTooltip
          visible={moderationDisabled && moderationHint.visible}
          text={isOfficialNovelaiProvider ? 'NovelAI 官方接口不使用审核参数' : 'fal.ai 不支持审核参数'}
        />
      </label>
      <label
        className="relative flex flex-col gap-0.5"
        onMouseEnter={() => { showAgentNHint(); streamConcurrentHint.show() }}
        onMouseLeave={() => { hideNLimitHint(); streamConcurrentHint.hide() }}
        onTouchStart={() => { startAgentNHintTouch(); streamConcurrentHint.startTouch() }}
        onTouchEnd={() => { clearAgentNHintTouchTimer(); streamConcurrentHint.clearTimer() }}
        onTouchCancel={() => {
          clearAgentNHintTouchTimer()
          hideNLimitHint()
          streamConcurrentHint.hide()
        }}
        onClick={() => { showAgentNHint(); streamConcurrentHint.show() }}
      >
        <span className="text-gray-400 dark:text-gray-500 ml-1">数量</span>
        <input
          value={nInput}
          onChange={(e) => handleNInputChange(e.target.value)}
          onFocus={() => setNInputFocused(true)}
          onBlur={() => {
            setNInputFocused(false)
            commitN()
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp') {
              handleNLimitIncreaseAttempt(() => e.preventDefault())
            }
          }}
          onWheel={(e) => {
            if (e.deltaY < 0) {
              handleNLimitIncreaseAttempt(() => e.preventDefault())
            }
          }}
          disabled={agentAutoImageCount}
          type={agentAutoImageCount ? 'text' : 'number'}
          min={agentAutoImageCount ? undefined : 1}
          max={agentAutoImageCount ? undefined : outputImageLimit}
          className={`px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-white/[0.08] focus:outline-none text-xs transition-all duration-200 shadow-sm ${
            agentAutoImageCount
              ? 'bg-gray-100/50 dark:bg-white/[0.05] opacity-50 cursor-not-allowed'
              : 'bg-white/50 dark:bg-white/[0.03]'
          }`}
        />
        <ButtonTooltip visible={nLimitHint.visible} text={nLimitHintText} />
        <ButtonTooltip visible={streamConcurrentByN && streamConcurrentHint.visible && !nLimitHint.visible} text="数量大于 1 时会将多图生成拆分为并发单图" />
      </label>
    </div>
  )
}
