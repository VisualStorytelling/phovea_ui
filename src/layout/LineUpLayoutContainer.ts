import {AParentLayoutContainer} from './AParentLayoutContainer';
import {EOrientation, ILayoutContainer, ISize} from './interfaces';

export default class LineUpLayoutContainer extends AParentLayoutContainer {
  readonly minChildCount = 0;

  constructor(document: Document, private readonly orientation: EOrientation, ...children: ILayoutContainer[]) {
    super(document);
    console.assert(orientation != null);

    this.node.dataset.layout = 'lineup';
    this.node.dataset.orientation = orientation === EOrientation.HORIZONTAL ? 'h' : 'v';
    children.forEach((d) => this.push(d));
  }

  get minSize() {
    console.assert(this.length > 1);
    switch (this.orientation) {
      case EOrientation.HORIZONTAL:
        return <ISize>this._children.reduce((a, c) => {
          const cmin = c.minSize;
          return [a[0] + cmin[0], Math.max(a[1], cmin[1])];
        }, [0, 0]);
      case EOrientation.VERTICAL: {
        return <ISize>this._children.reduce((a, c) => {
          const cmin = c.minSize;
          return [Math.max(a[0], cmin[0]), a[1] + cmin[1]];
        }, [0, 0]);
      }
    }
  }
  push(child: ILayoutContainer) {
    const r = super.push(child);
    this.node.appendChild(child.node);
    return r;
  }

  remove(child: ILayoutContainer) {
    child.parent = null;
    child.node.remove();
    return true;
  }
}
