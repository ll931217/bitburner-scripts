/**
 * Shortest Path in a Grid
 * You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.
 *
 *
 * You are located in the top-left corner of the following grid:
 *
 *   [[0,0,0,0,0,0,0,0,1,0,0],
 *    [0,0,0,0,0,1,0,1,1,0,0],
 *    [0,0,0,1,0,1,0,0,0,1,0],
 *    [0,0,0,1,1,1,0,0,0,0,1],
 *    [0,1,0,0,0,0,0,0,0,0,0],
 *    [0,1,1,1,0,1,0,0,0,0,0],
 *    [1,0,0,0,1,0,1,0,0,0,0]]
 *
 * You are trying to find the shortest path to the bottom-right corner of the grid, but there are obstacles on the grid that you cannot move onto. These obstacles are denoted by '1', while empty spaces are denoted by 0.
 *
 * Determine the shortest path from start to finish, if one exists. The answer should be given as a string of UDLR characters, indicating the moves along the path
 *
 * NOTE: If there are multiple equally short paths, any of them is accepted as answer. If there is no path, the answer should be an empty string.
 * NOTE: The data returned for this contract is an 2D array of numbers representing the grid.
 *
 * Examples:
 *
 *     [[0,1,0,0,0],
 *      [0,0,0,1,0]]
 *
 * Answer: 'DRRURRD'
 *
 *     [[0,1],
 *      [1,0]]
 *
 * Answer: ''
 */

import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
    // Determine the shortest path from top-left to bottom right, if one exists. The answer should be given as a string of UDLR characters, indicating the moves along the path
    const grid = [
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0],
        [0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
        [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
    ];

    const path = findShortestPathInGrid(grid);

    ns.tprint(`Path: ${path}`);
}

function findShortestPathInGrid(grid: number[][]): string | null {
    const rows = grid.length;
    const cols = grid[0].length;

    const directions = ["U", "D", "L", "R"];
    const dr = [-1, 1, 0, 0];
    const dc = [0, 0, -1, 1];

    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    visited[0][0] = true;

    const queue = [{ row: 0, col: 0, path: "" }];

    while (queue.length > 0) {
        const { row, col, path } = queue.shift()!;

        if (row === rows - 1 && col === cols - 1) {
            return path;
        }

        for (let i = 0; i < 4; i++) {
            const newRow = row + dr[i];
            const newCol = col + dc[i];

            if (
                newRow >= 0 &&
                newRow < rows &&
                newCol >= 0 &&
                newCol < cols &&
                grid[newRow][newCol] === 0 &&
                !visited[newRow][newCol]
            ) {
                visited[newRow][newCol] = true;
                queue.push({ row: newRow, col: newCol, path: path + directions[i] });
            }
        }
    }

    return null;
}
