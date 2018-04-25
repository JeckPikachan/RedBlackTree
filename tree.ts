/**
 * Created by chery on 25.04.2018.
 */

export class RedBlackTree {
    private root: TreeNodeNullable;

    constructor() {
        this.root = null;
    }

    public insert(key: number): void {
        let treeNode: TreeNode = new TreeNode(key);
        if (this.root === null) {
            this.root = treeNode;
        } else {
            let currentNode: TreeNode = this.root;
            let nextNode: TreeNodeNullable = currentNode;

            while (nextNode !== null) {
                currentNode = nextNode;
                if (currentNode.key > treeNode.key) {
                    nextNode = currentNode.left;
                } else if (currentNode.key < treeNode.key) {
                    nextNode = currentNode.right;
                } else {
                    return; // return if node with that key already exists
                }
            }

            if (currentNode.key > treeNode.key) {
                currentNode.left = treeNode;
            } else {
                currentNode.right = treeNode;
            }
            treeNode.parent = currentNode;
        }

        this.insertCase1(treeNode); // need to change root after all rotations
        while (treeNode.parent !== null) {
            treeNode = treeNode.parent;
        }
        this.root = treeNode;
    }

    public insertMany(keys: Array<number>, afterEach?: Function): void {
        keys.forEach(key => {
            this.insert(key);
            if (afterEach) {
                afterEach();
            }
        });
    }

    public toString(): string {
        return this.print(this.root, 0);
    }

    private print(treeNode: TreeNodeNullable, n: number): string {
        let res: string = "";
        if (treeNode !== null) {
            res += this.print(treeNode.right, n + 5);
            for (let i = 0; i < n; i++) {
                res += " ";
            }
            res += (treeNode.color === TreeColors.red ? "\x1b[31m" : "") + treeNode.key.toString() + "\x1b[0m" + "\n";
            res += this.print(treeNode.left, n + 5);
        }
        return res;
    }

    private grandparent(treeNode: TreeNodeNullable): TreeNodeNullable {
        if (treeNode !== null && treeNode.parent !== null) {
            return treeNode.parent.parent; // also will return null, if parent has no parent. It's ok.
        } else {
            return null;
        }
    }

    private uncle(treeNode: TreeNodeNullable): TreeNodeNullable {
        const grandparent: TreeNodeNullable = this.grandparent(treeNode);
        if (grandparent === null) {
            return null;
        }

        if (treeNode!.parent === grandparent.left) {
            return grandparent.right;
        } else {
            return grandparent.left;
        }
    }

    private rotateLeft(treeNode: TreeNode): void {
        let pivot: TreeNodeNullable = treeNode.right;
        if (pivot === null)
            return;

        pivot.parent = treeNode.parent;
        if (treeNode.parent !== null) {
            if (treeNode.parent.left === treeNode) {
                treeNode.parent.left = pivot;
            } else {
                treeNode.parent.right = pivot;
            }
        }

        treeNode.right = pivot.left;
        if (pivot.left !== null) {
            pivot.left.parent = treeNode;
        }

        treeNode.parent = pivot;
        pivot.left = treeNode;
    }

    private rotateRight(treeNode: TreeNode): void {
        let pivot: TreeNodeNullable = treeNode.left;
        if (pivot === null)
            return;

        pivot.parent = treeNode.parent;
        if (treeNode.parent !== null) {
            if (treeNode.parent.left === treeNode) {
                treeNode.parent.left = pivot;
            } else {
                treeNode.parent.right = pivot;
            }
        }

        treeNode.left = pivot.right;
        if (pivot.right !== null) {
            pivot.right.parent = treeNode;
        }

        treeNode.parent = pivot;
        pivot.right = treeNode;
    }

    // if treeNode is in root
    private insertCase1(treeNode: TreeNode): void {
        if (treeNode.parent === null) {
            treeNode.color = TreeColors.black;
        } else {
            this.insertCase2(treeNode);
        }
    }

    // if parent of treeNode is black
    private insertCase2(treeNode: TreeNode): void {
        if (treeNode.parent!.color === TreeColors.black) {
            return;
        } else {
            this.insertCase3(treeNode);
        }
    }

    // if parent and uncle are red
    private insertCase3(treeNode: TreeNode): void {
        let uncle: TreeNodeNullable = this.uncle(treeNode);

        if (uncle !== null && uncle.color === TreeColors.red) {
            treeNode.parent!.color = TreeColors.black;
            uncle.color = TreeColors.black;

            let grandparent: TreeNode = <TreeNode>this.grandparent(treeNode);
            grandparent.color = TreeColors.red;
            this.insertCase1(grandparent);
        } else {
            this.insertCase4(treeNode);
        }
    }

    // if parent is red, but uncle is not and treeNode is the left son while parent is right son
    // or treeNode is right son and parent is left son
    private insertCase4(treeNode: TreeNode): void {
        let grandparent: TreeNode = <TreeNode>this.grandparent(treeNode);

        if (treeNode.parent!.right === treeNode && grandparent.left === treeNode.parent) {
            this.rotateLeft(<TreeNode>treeNode.parent);

            treeNode = <TreeNode>treeNode.left;
        } else if (treeNode.parent!.left === treeNode && grandparent.right === treeNode.parent) {
            this.rotateRight(<TreeNode>treeNode.parent);

            treeNode = <TreeNode>treeNode.right;
        }

        this.insertCase5(treeNode);
    }

    // last case
    private insertCase5(treeNode: TreeNode): void {
        let grandparent: TreeNode = <TreeNode>this.grandparent(treeNode);

        treeNode.parent!.color = TreeColors.black;
        grandparent.color = TreeColors.red;

        if (treeNode.parent!.left === treeNode && grandparent.left === treeNode.parent) {
            this.rotateRight(grandparent);
        } else {
            this.rotateLeft(grandparent);
        }
    }


}

type TreeNodeNullable = TreeNode | null;

class TreeNode {
    public parent: TreeNodeNullable;
    public left: TreeNodeNullable;
    public right: TreeNodeNullable;
    public color: TreeColors;
    public key: number;

    constructor(key: number) {
        this.parent = null;
        this.left = null;
        this.right = null;
        this.color = TreeColors.red;
        this.key = key;
    }
}

enum TreeColors {
    red,
    black
}