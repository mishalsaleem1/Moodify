export class PaginationQueryDto {
  page: number = 1;
  limit: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
