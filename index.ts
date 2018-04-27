import {RedBlackTree} from "./tree";

function shuffle(a: Array<any>) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function getSequenceArray(n: number): Array<number> {
    let res: Array<number> = [];
    for (let i = 1; i <= n; i++) {
        res.push(i);
    }
    return res;
}

let tree: RedBlackTree = new RedBlackTree();
tree.insertMany(shuffle(getSequenceArray(15)), () => console.log("=====================================\n" + tree.toString() + "=====================================\n\n"));

tree.remove(5);
tree.remove(13);
tree.remove(9);
console.log("\n=============================\n" + tree.toString());
// console.log(tree.toString());