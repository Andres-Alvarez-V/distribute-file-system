const fs = require("fs");
const path = require("path");
const { writeFile, createDestinationFolder } = require("./writeFile");

function splitFile(filePath, blocksIdentifiers) {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, async (err, data) => {
			if (err) {
				reject(err);
			} else {
				const blockIdentifiersGroup = [];
				blocksIdentifiers.reduce((acc, curr) => {
					const key = curr.blockIdentifier;
					if (!acc[key]) {
						acc[key] = 1;
            blockIdentifiersGroup.push(curr);
					}
					return acc;
				}, {});
				const blockSize = Math.ceil(data.length / blockIdentifiersGroup.length);
				const destinationFolder = createDestinationFolder(
					filePath,
					"../../repositories/filesBlocks/"
				);
				const fileNames = await createFileBlocks(
					data,
					blockSize,
					blockIdentifiersGroup,
					destinationFolder
				);
				resolve(fileNames);
			}
		});
	});
}

async function createFileBlocks(
	data,
	blockSize,
	blocksIdentifiers,
	destinationFolder
) {
	let start = 0;
	const fileNames = [];

	await Promise.all(
		blocksIdentifiers
			.sort((a, b) => a.turn - b.turn)
			.map(async (blockIdentifier, i) => {
				const end = Math.min(start + blockSize, data.length);
				const block = data.slice(start, end);
				const fileName = blockIdentifier.blockIdentifier;
				const filePath = path.join(destinationFolder, fileName);

				await writeFile(filePath, block);
				fileNames.push(filePath);
				start = end;
			})
	);

	return fileNames;
}

module.exports = splitFile;
