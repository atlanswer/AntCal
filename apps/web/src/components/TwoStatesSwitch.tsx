export { TwoStateSwitch };

function TwoStateSwitch(props: { a: string; b: string }) {
  return (
    <button type="button" name="Switch state" class="rounded-full bg-gray-500">
      {props.a}
    </button>
  );
}
