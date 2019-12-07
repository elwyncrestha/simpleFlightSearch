export class ObjectUtil {
  public static isEmpty(object: any) {
    return object === undefined || object === null || object === '';
  }

  public static setUndefinedIfNull(value: any) {
    return ObjectUtil.isEmpty(value) ? undefined : value;
  }
}
