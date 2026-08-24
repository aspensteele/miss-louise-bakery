import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

func removeConnectedLightBackground(from inputPath: String, to outputPath: String) throws {
    let inputURL = URL(fileURLWithPath: inputPath) as CFURL
    guard let source = CGImageSourceCreateWithURL(inputURL, nil),
          let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
        throw NSError(domain: "BackgroundRemoval", code: 1)
    }

    let width = image.width
    let height = image.height
    let bytesPerPixel = 4
    let bytesPerRow = width * bytesPerPixel
    var pixels = [UInt8](repeating: 0, count: height * bytesPerRow)
    let colorSpace = CGColorSpaceCreateDeviceRGB()
    guard let context = CGContext(data: &pixels, width: width, height: height,
                                  bitsPerComponent: 8, bytesPerRow: bytesPerRow,
                                  space: colorSpace,
                                  bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) else {
        throw NSError(domain: "BackgroundRemoval", code: 2)
    }
    context.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))

    func isBackground(_ index: Int) -> Bool {
        let offset = index * 4
        let r = Int(pixels[offset])
        let g = Int(pixels[offset + 1])
        let b = Int(pixels[offset + 2])
        return min(r, g, b) >= 220 && max(r, g, b) - min(r, g, b) <= 22
    }

    var visited = [Bool](repeating: false, count: width * height)
    var queue = [Int]()
    queue.reserveCapacity(width * 2 + height * 2)
    for x in 0..<width { queue.append(x); queue.append((height - 1) * width + x) }
    for y in 0..<height { queue.append(y * width); queue.append(y * width + width - 1) }

    var cursor = 0
    while cursor < queue.count {
        let index = queue[cursor]
        cursor += 1
        if visited[index] || !isBackground(index) { continue }
        visited[index] = true
        let x = index % width
        let y = index / width
        pixels[index * 4 + 3] = 0
        if x > 0 { queue.append(index - 1) }
        if x + 1 < width { queue.append(index + 1) }
        if y > 0 { queue.append(index - width) }
        if y + 1 < height { queue.append(index + width) }
    }

    guard let outputContext = CGContext(data: &pixels, width: width, height: height,
                                        bitsPerComponent: 8, bytesPerRow: bytesPerRow,
                                        space: colorSpace,
                                        bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue),
          let outputImage = outputContext.makeImage(),
          let destination = CGImageDestinationCreateWithURL(
            URL(fileURLWithPath: outputPath) as CFURL,
            UTType.png.identifier as CFString, 1, nil
          ) else {
        throw NSError(domain: "BackgroundRemoval", code: 3)
    }
    CGImageDestinationAddImage(destination, outputImage, nil)
    guard CGImageDestinationFinalize(destination) else {
        throw NSError(domain: "BackgroundRemoval", code: 4)
    }
}

guard CommandLine.arguments.count == 3 else {
    fputs("usage: remove_background.swift input.png output.png\n", stderr)
    exit(2)
}

try removeConnectedLightBackground(from: CommandLine.arguments[1], to: CommandLine.arguments[2])
