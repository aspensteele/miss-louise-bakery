import Foundation
import AVFoundation

guard CommandLine.arguments.count == 3 else {
    fputs("usage: convert_video.swift input.mov output.mp4\n", stderr)
    exit(2)
}

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])
let asset = AVURLAsset(url: inputURL)

guard let exporter = AVAssetExportSession(asset: asset, presetName: AVAssetExportPresetHighestQuality) else {
    fputs("Could not create video exporter.\n", stderr)
    exit(3)
}

try? FileManager.default.removeItem(at: outputURL)
exporter.outputURL = outputURL
exporter.outputFileType = .mp4
exporter.shouldOptimizeForNetworkUse = true

let completion = DispatchSemaphore(value: 0)
exporter.exportAsynchronously { completion.signal() }
completion.wait()

switch exporter.status {
case .completed:
    print(outputURL.path)
case .failed, .cancelled:
    fputs("Video export failed: \(exporter.error?.localizedDescription ?? "unknown error")\n", stderr)
    exit(4)
default:
    fputs("Video export ended with status \(exporter.status.rawValue).\n", stderr)
    exit(5)
}
