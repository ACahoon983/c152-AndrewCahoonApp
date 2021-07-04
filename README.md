# SpeedRunAppDemo
Simple Express/Mongoose server showcasing skills learned from c152

It uses a little of the speedrun.com API, but I was unable to parse the json
object and map it in order to actually give the user the data they were
requesting.

Aside from that, this app uses authentication, a bootstrap accordion, and keeps
a database of user submitted speedruns.

If I were to improve upon this app, I would include a submission form for videos,
as well as integrate with the speedrun.com API better, so that users could
search up any game and get the leaderboards for them.

The problem encountered with the aforementioned API was that it was split in this
manner: json:data: : id:...
                   : id:...
and I simply did not know how to parse, nor could I find a solution that was
to my liking.
