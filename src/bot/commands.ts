export const commands = [
  {
    cmd: 'help',
    info: 'Show all available commands',
  },
  {
    cmd: 'emojis',
    info: 'Show all available emojis',
  },
  {
    cmd: 'top5',
    info: 'Show top5 list today <defaults to>',
    subCmd: [
      {
        cmd: 'to',
        info: 'Return list of top5 receiver'
      },
      {
        cmd: 'from',
        info: 'Return list of top5 sender'
      }
    ]
  }
];
