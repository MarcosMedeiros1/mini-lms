import { Api } from "../../core/utils/abstract.ts";
import { lmsTables, lmsViews } from "./tables.ts";

export class LmsApi extends Api {
  tables(): void {
    this.db.exec(lmsTables);
    this.db.exec(lmsViews);
  }
}
