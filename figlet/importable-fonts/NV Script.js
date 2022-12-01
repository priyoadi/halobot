export default `flf2a$ 16 10 25 0 32

Script by Normand Veilleux
FIGlet Font compiled by Jerrad Pierce <jpierce@cpan.org>
Prior (independent) conception by Colin Douthwaite

A second set of lowercase characters, with special ligatures,
to follow 'b', 'o', 'v' and 'w' is available. To access them
use the character code 200+the letter of the alphabet
eg; 201 is 'a' 226 is 'z' and 'bomb' is b + 215 + 213 + b

On windows use Alt+# (on the numpad) to enter the code.
For anything else you are on your own.
HINT: perl -e 'print chr(210)' will get you a special j

#The following is applicable for smushmode -1
At times, you will have to delete a portion of the area between
two letters in order for them to connect properly (manual kerning).
In other cases you may have to add an '8' to fill the gap between
the two letters.  In any case, always leave a minimum of two spaces
between the letters (except where they actually touch). This appear
to give the best results.

Explanation of first line:
flf2 - "magic number" for file identification
a    - should always be \`a', for now
$    - the "hardblank" -- prints as a blank, but can't be smushed
16    - height of a character
10    - height of a character, not including descenders
25   - max line length (excluding comment lines) + a fudge factor
0   - default smushmode for this font
32   - number of comment lines

     $@
     $@
     $@
     $@
     $@
     $@
     $@
     $@
     $@
     $@
     $@
     $@
     $@
     $@
     $@
     $@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
           ,ggg,  @
          dP""8I  @
         dP   88  @
        dP    88  @
       ,8'    88  @
       d88888888  @
 __   ,8"     88  @
dP"  ,8P      Y8  @
Yb,_,dP       \`8b,@
 "Y8P"         \`Y8@
                  @
                  @
                  @
                  @
                  @
                  @@
 ,ggggggggggg,  @
dP"""88""""""Y8,@
Yb,  88      \`8b@
 \`"  88      ,8P@
     88aaaad8P" @
     88""""Y8ba @
     88      \`8b@
     88      ,8P@
     88_____,d8'@
    88888888P"  @
                @
                @
                @
                @
                @
                @@
     ,gggg,  @
   ,88"""Y8b,@
  d8"     \`Y8@
 d8'   8b  d8@
,8I    "Y88P'@
I8'          @
d8           @
Y8,          @
\`Yba,,_____, @
  \`"Y8888888 @
             @
             @
             @
             @
             @
             @@
 ,gggggggggggg,   @
dP"""88""""""Y8b, @
Yb,  88       \`8b,@
 \`"  88        \`8b@
     88         Y8@
     88         d8@
     88        ,8P@
     88       ,8P'@
     88______,dP' @
    888888888P"   @
                  @
                  @
                  @
                  @
                  @
                  @@
   ,ggggggg, @
 ,dP""""""Y8b@
 d8'    a  Y8@
 88     "Y8P'@
 \`8baaaa     @
,d8P""""     @
d8"          @
Y8,          @
\`Yba,,_____, @
  \`"Y8888888 @
             @
             @
             @
             @
             @
             @@
 ,gggggggggggggg@
dP""""""88""""""@
Yb,_    88      @
 \`""    88      @
     ggg88gggg  @
        88   8  @
        88      @
  gg,   88      @
   "Yb,,8P      @
     "Y8P'      @
                @
                @
                @
                @
                @
                @@
    ,gg,      @
   i8""8i     @
   \`8,,8'     @
    \`Y88aaad8 @
     d8""""Y8,@
    ,8P     8b@
    dP      Y8@
_ ,dP'      I8@
"888,,_____,dP@
a8P"Y888888P" @
              @
              @
              @
              @
              @
              @@
 ,ggg,        gg @
dP""Y8b       88 @
Yb, \`88       88 @
 \`"  88       88 @
     88aaaaaaa88 @
     88"""""""88 @
     88       88 @
     88       88 @
     88       Y8,@
     88       \`Y8@
                 @
                 @
                 @
                 @
                 @
                 @@
      ,a8a, @
     ,8" "8,@
     d8   8b@
     88   88@
     88   88@
     Y8   8P@
     \`8, ,8'@
8888  "8,8" @
\`8b,  ,d8b, @
  "Y88P" "Y8@
            @
            @
            @
            @
            @
            @@
     gg     @
    dP8,    @
   dP Yb    @
  ,8  \`8,   @
  I8   Yb   @
  \`8b, \`8,  @
   \`"Y88888 @
       "Y8  @
        ,88,@
    ,ad88888@
  ,dP"'   Yb@
 ,8'      I8@
,8'       I8@
I8,      ,8'@
\`Y8,___,d8' @
  "Y888P"   @@
 ,ggg,        gg @
dP""Y8b       dP @
Yb, \`88      d8' @
 \`"  88    ,dP'  @
     88aaad8"    @
     88""""Yb,   @
     88     "8b  @
     88      \`8i @
     88       Yb,@
     88        Y8@
                 @
                 @
                 @
                 @
                 @
                 @@
       ,gggg,  @
      d8" "8I  @
      88  ,dP  @
   8888888P"   @
      88       @
      88       @
 ,aa,_88       @
dP" "88P       @
Yb,_,d88b,,_   @
 "Y8P"  "Y88888@
               @
               @
               @
               @
               @
               @@
 ,ggg, ,ggg,_,ggg,  @
dP""Y8dP""Y88P""Y8b @
Yb, \`88'  \`88'  \`88 @
 \`"  88    88    88 @
     88    88    88 @
     88    88    88 @
     88    88    88 @
     88    88    88 @
     88    88    Y8,@
     88    88    \`Y8@
                    @
                    @
                    @
                    @
                    @
                    @@
 ,ggg, ,ggggggg,  @
dP""Y8,8P"""""Y8b @
Yb, \`8dP'     \`88 @
 \`"  88'       88 @
     88        88 @
     88        88 @
     88        88 @
     88        88 @
     88        Y8,@
     88        \`Y8@
                  @
                  @
                  @
                  @
                  @
                  @@
   _,gggggg,_     @
 ,d8P""d8P"Y8b,   @
,d8'   Y8   "8b,dP@
d8'    \`Ybaaad88P'@
8P       \`""""Y8  @
8b            d8  @
Y8,          ,8P  @
\`Y8,        ,8P'  @
 \`Y8b,,__,,d8P'   @
   \`"Y8888P"'     @
                  @
                  @
                  @
                  @
                  @
                  @@
 ,ggggggggggg,  @
dP"""88""""""Y8,@
Yb,  88      \`8b@
 \`"  88      ,8P@
     88aaaad8P" @
     88"""""    @
     88         @
     88         @
     88         @
     88         @
                @
                @
                @
                @
                @
                @@
     _,ggg,_    @
    d8P"""Y8b,  @
    88,    "8b, @
     "Y8baaa\`8b @
        \`""" Y8 @
             d8 @
,ad8888b,   ,8P @
I8P'  \`"Y8a,8P' @
I8b,,___,,888b,_@
 \`"Y88888P"' "Y8@
                @
                @
                @
                @
                @
                @@
 ,ggggggggggg,   @
dP"""88""""""Y8, @
Yb,  88      \`8b @
 \`"  88      ,8P @
     88aaaad8P"  @
     88""""Yb,   @
     88     "8b  @
     88      \`8i @
     88       Yb,@
     88        Y8@
                 @
                 @
                 @
                 @
                 @
                 @@
      ,gg,   @
     i8""8i  @
     \`8,,8'  @
      \`88'   @
      dP"8,  @
     dP' \`8a @
    dP'   \`Yb@
_ ,dP'     I8@
"888,,____,dP@
a8P"Y88888P" @
             @
             @
             @
             @
             @
             @@
 ,ggggggggggggggg@
dP""""""88"""""""@
Yb,_    88       @
 \`""    88       @
        88       @
        88       @
        88       @
  gg,   88       @
   "Yb,,8P       @
     "Y8P'       @
                 @
                 @
                 @
                 @
                 @
                 @@
 ,ggg,         gg @
dP""Y8a        88 @
Yb, \`88        88 @
 \`"  88        88 @
     88        88 @
     88        88 @
     88        88 @
     88        88 @
     Y8b,____,d88,@
      "Y888888P"Y8@
                  @
                  @
                  @
                  @
                  @
                  @@
 ,ggg,         ,gg@
dP""Y8a       ,8P @
Yb, \`88       d8' @
 \`"  88       88  @
     88       88  @
     I8       8I  @
     \`8,     ,8'  @
      Y8,   ,8P   @
       Yb,_,dP    @
        "Y8P"     @
                  @
                  @
                  @
                  @
                  @
                  @@
 ,ggg,      gg      ,gg@
dP""Y8a     88     ,8P @
Yb, \`88     88     d8' @
 \`"  88     88     88  @
     88     88     88  @
     88     88     88  @
     88     88     88  @
     Y8    ,88,    8P  @
      Yb,,d8""8b,,dP   @
       "88"    "88"    @
                       @
                       @
                       @
                       @
                       @
                       @@
 ,ggg,          ,gg@
dP"""Y8,      ,dP' @
Yb,_  "8b,   d8"   @
 \`""    Y8,,8P'    @
         Y88"      @
        ,888b      @
       d8" "8b,    @
     ,8P'    Y8,   @
    d8"       "Yb, @
  ,8P'          "Y8@
                   @
                   @
                   @
                   @
                   @
                   @@
 ,ggg,         gg @
dP""Y8a        88 @
Yb, \`88        88 @
 \`"  88        88 @
     88        88 @
     88        88 @
     88       ,88 @
     Y8b,___,d888 @
      "Y88888P"88,@
           ,ad8888@
          d8P" 88 @
        ,d8'   88 @
        d8'    88 @
        88     88 @
        Y8,_ _,88 @
         "Y888P"  @@
 ,gggggggg,    @
d8P""""""Y8b,  @
88,_a     \`8b  @
\`Y8P"      88  @
           88  @
          d8'  @
       _,d8'   @
     d8888ba,  @
         "Y88b,@
         ,d8888@
       ,8P"  88@
      d8'    88@
     d8'    ,88@
     88     d8'@
     Y8,_ _,8P @
      "Y888P"  @@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
            @
            @
            @
            @
            @
   ,gggg,gg @
  dP"  "Y8I @
 i8'    ,8I @
,d8,   ,d8b,@
P"Y8888P"\`Y8@
            @
            @
            @
            @
            @
            @@
            @
 ,dPYb,     @
 IP'\`Yb     @
 I8  8I     @
 I8  8'     @
 I8 dP      @
 I8dP   88gg@
 I8P    8I  @
,d8b,  ,8I  @
8P'"Y88P"'  @
            @
            @
            @
            @
            @
            @@
          @
          @
          @
          @
          @
   ,gggg, @
  dP"  "Yb@
 i8'      @
,d8,_    _@
P""Y8888PP@
          @
          @
          @
          @
          @
          @@
            @
         8I @
         8I @
         8I @
         8I @
   ,gggg,8I @
  dP"  "Y8I @
 i8'    ,8I @
,d8,   ,d8b,@
P"Y8888P"\`Y8@
            @
            @
            @
            @
            @
            @@
         @
         @
         @
         @
         @
  ,ggg,  @
 i8" "8i @
 I8, ,8I @
 \`YbadP' @
888P"Y888@
         @
         @
         @
         @
         @
         @@
        @
 ,dPYb, @
 IP'\`Yb @
 I8  8I @
 I8  8' @
 I8 dP  @
 I8dP   @
 I8P    @
,d8b,_  @
PI8"888 @
 I8 \`8, @
 I8  \`8,@
 I8   8I@
 I8   8I@
 I8, ,8'@
  "Y8P' @@
            @
            @
            @
            @
            @
   ,gggg,gg @
  dP"  "Y8I @
 i8'    ,8I @
,d8,   ,d8I @
P"Y8888P"888@
       ,d8I'@
     ,dP'8I @
    ,8"  8I @
    I8   8I @
    \`8, ,8I @
     \`Y8P"  @@
           @
 ,dPYb,    @
 IP'\`Yb    @
 I8  8I    @
 I8  8'    @
 I8 dPgg,  @
 I8dP" "8I @
 I8P    I8 @
,d8     I8,@
88P     \`Y8@
           @
           @
           @
           @
           @
           @@
      @
      @
      @
  gg  @
  ""  @
  gg  @
  88  @
  88  @
_,88,_@
8P""Y8@
      @
      @
      @
      @
      @
      @@
        @
        @
        @
     gg @
     "" @
     gg @
     8I @
    ,8I @
  _,d8I @
888P"888@
   ,d8I'@
 ,dP'8I @
,8"  8I @
I8   8I @
\`8, ,8I @
 \`Y8P"  @@
           @
 ,dPYb,    @
 IP'\`Yb    @
 I8  8I    @
 I8  8bgg, @
 I8 dP" "8 @
 I8d8bggP" @
 I8P' "Yb, @
,d8    \`Yb,@
88P      Y8@
           @
           @
           @
           @
           @
           @@
       @
 ,dPYb,@
 IP'\`Yb@
 I8  8I@
 I8  8'@
 I8 dP @
 I8dP  @
 I8P   @
,d8b,_ @
8P'"Y88@
       @
       @
       @
       @
       @
       @@
                   @
                   @
                   @
                   @
                   @
  ,ggg,,ggg,,ggg,  @
 ,8" "8P" "8P" "8, @
 I8   8I   8I   8I @
,dP   8I   8I   Yb,@
8P'   8I   8I   \`Y8@
                   @
                   @
                   @
                   @
                   @
                   @@
              @
              @
              @
              @
              @
  ,ggg,,ggg,  @
 ,8" "8P" "8, @
 I8   8I   8I @
,dP   8I   Yb,@
8P'   8I   \`Y8@
              @
              @
              @
              @
              @
              @@
             @
             @
             @
             @
             @
   ,ggggg,   @
  dP"  "Y8ggg@
 i8'    ,8I  @
,d8,   ,d8'  @
P"Y8888P"    @
             @
             @
             @
             @
             @
             @@
            @
            @
            @
            @
            @
 gg,gggg,   @
 I8P"  "Yb  @
 I8'    ,8i @
,I8 _  ,d8' @
PI8 YY88888P@
 I8         @
 I8         @
 I8         @
 I8         @
 I8         @
 I8         @@
            @
            @
            @
            @
            @
   ,gggg,gg @
  dP"  "Y8I @
 i8'    ,8I @
,d8,   ,d8b @
P"Y8888P"88d@
         I8P@
         I8'@
         I8 @
         I8 @
         I8 @
         I8 @@
           @
           @
           @
           @
           @
  ,gggggg, @
  dP""""8I @
 ,8'    8I @
,dP     Y8,@
8P      \`Y8@
           @
           @
           @
           @
           @
           @@
          @
          @
          @
          @
          @
   ,g,    @
  ,8'8,   @
 ,8'  Yb  @
,8'_   8) @
P' "YY8P8P@
          @
          @
          @
          @
          @
          @@
        @
   I8   @
   I8   @
88888888@
   I8   @
   I8   @
   I8   @
  ,I8,  @
 ,d88b, @
 8P""Y8 @
        @
        @
        @
        @
        @
        @@
            @
            @
            @
            @
            @
 gg      gg @
 I8      8I @
 I8,    ,8I @
,d8b,  ,d8b,@
8P'"Y88P"\`Y8@
            @
            @
            @
            @
            @
            @@
               @
               @
               @
               @
               @
    ggg    gg  @
   d8"Yb   88bg@
  dP  I8   8I  @
,dP   I8, ,8I  @
8"     "Y8P"   @
               @
               @
               @
               @
               @
               @@
                 @
                 @
                 @
                 @
                 @
 gg    gg    gg  @
 I8    I8    88bg@
 I8    I8    8I  @
,d8,  ,d8,  ,8I  @
P""Y88P""Y88P"   @
                 @
                 @
                 @
                 @
                 @
                 @@
              @
              @
              @
              @
              @
    ,gg,   ,gg@
   d8""8b,dP" @
  dP   ,88"   @
,dP  ,dP"Y8,  @
8"  dP"   "Y8 @
              @
              @
              @
              @
              @
              @@
           @
           @
           @
           @
           @
 gg     gg @
 I8     8I @
 I8,   ,8I @
,d8b, ,d8I @
P""Y88P"888@
      ,d8I'@
    ,dP'8I @
   ,8"  8I @
   I8   8I @
   \`8, ,8I @
    \`Y8P"  @@
           @
           @
           @
           @
           @
    ,gggg, @
   d8"  Yb @
  dP    dP @
,dP  ,adP' @
8"   ""Y8d8@
      ,d8I'@
    ,dP'8I @
   ,8"  8I @
   I8   8I @
   \`8, ,8I @
    \`Y8P"  @@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@
@@
201 SANS-a
           @
           @
           @
           @
           @
  ,gggg,gg @
gdP"  "Y8I @
I8'    ,8I @
Y8,   ,d8b,@
\`Y8888P"\`Y8@
           @
           @
           @
           @
           @
           @@
202 SANS-b
           @
,dPYb,     @
IP'\`Yb     @
I8  8I     @
I8  8'     @
I8,dP      @
I8P"   88gg@
I8,    8I  @
I8b,  ,8I  @
 "Y888P"'  @
           @
           @
           @
           @
           @
           @@
203 SANS-c
         @
         @
         @
         @
         @
  ,gggg, @
gdP"  "Yb@
I8'      @
Y8,_    _@
 "Y8888PP@
         @
         @
         @
         @
         @
         @@
204 SANS-d
           @
        8I @
        8I @
        8I @
        8I @
  ,gggg,8I @
gdP"  "Y8I @
I8'    ,8I @
Y8,   ,d8b,@
\`Y8888P"\`Y8@
           @
           @
           @
           @
           @
           @@
205 SANS-e
        @
        @
        @
        @
        @
 ,ggg,  @
i8" "8i @
I8baaP' @
Y8,_    @
\`"Y8888P@
        @
        @
        @
        @
        @
        @@
206 SANS-f
       @
,dPYb, @
IP'\`Yb @
I8  8I @
I8  8' @
I8,dP  @
I8P"   @
I8,    @
I8b,_  @
I8"888 @
I8 \`8, @
I8  \`8,@
I8   8I@
I8   8I@
I8, ,8'@
 "Y8P' @@
207 SANS-g
           @
           @
           @
           @
           @
  ,gggg,gg @
gdP"  "Y8I @
I8'    ,8I @
Y8,   ,d8I @
\`Y8888P"888@
      ,d8I'@
    ,dP'8I @
   ,8"  8I @
   I8   8I @
   \`8, ,8I @
    \`Y8P"  @@
208 SANS-h
          @
,dPYb,    @
IP'\`Yb    @
I8  8I    @
I8  8'    @
I8,dPgg,  @
I88P" "8I @
I8P    I8 @
I8     I8,@
I8     \`Y8@
          @
          @
          @
          @
          @
          @@
209 SANS-i
    @
    @
    @
gg  @
""  @
gg  @
88  @
88  @
88,_@
"Y88@
    @
    @
    @
    @
    @
    @@
210 SANS-j
        @
        @
        @
     gg @
     "" @
    ,gg @
  gP"8I @
     8I @
     8I @
     888@
   ,d8I'@
 ,dP'8I @
,8"  8I @
I8   8I @
\`8, ,8I @
 \`Y8P"  @@
211 SANS-k
          @
,dPYb,    @
IP'\`Yb    @
I8  8I    @
I8  8bgg, @
I8,dP" "8 @
I888bggP" @
I8'  "Yb, @
I8    \`Yb,@
I8      Y8@
          @
          @
          @
          @
          @
          @@
212 SANS-l
      @
,dPYb,@
IP'\`Yb@
I8  8I@
I8  8'@
I8,dP @
I8P"  @
I8,   @
\`Yb,_ @
  "Y88@
      @
      @
      @
      @
      @
      @@
213 SANS-m
                @
                @
                @
                @
                @
,gg,,ggg,,ggg,  @
P""8P" "8P" "8, @
   8I   8I   8I @
   8I   8I   Yb,@
   8I   8I   \`Y8@
                @
                @
                @
                @
                @
                @@
214 SANS-n
           @
           @
           @
           @
           @
,gg,,ggg,  @
P""8P" "8, @
   8I   8I @
   8I   Yb,@
   8I   \`Y8@
           @
           @
           @
           @
           @
           @@
215 SANS-o
            @
            @
            @
            @
            @
  ,ggggg,   @
gdP"  "Y8ggg@
I8'    ,8I  @
Y8,   ,d8'  @
\`Y8888P"    @
            @
            @
            @
            @
            @
            @@
216 SANS-p
           @
           @
           @
           @
           @
gg,gggg,   @
88P"  "Yb  @
I8'    ,8i @
I8 _  ,d8' @
I8 YY88888P@
I8         @
I8         @
I8         @
I8         @
I8         @
I8         @@
217 SANS-q
           @
           @
           @
           @
           @
  ,gggg,gg @
gdP"  "Y8I @
I8'    ,8I @
Y8,   ,d8b @
\`Y8888P"88d@
        I8P@
        I8'@
        I8 @
        I8 @
        I8 @
        I8 @@
218 SANS-r
        @
        @
        @
        @
        @
,ggggg, @
8""""8I @
     8I @
     Y8,@
     \`Y8@
        @
        @
        @
        @
        @
        @@
219 SANS-s
         @
         @
         @
         @
         @
  ,g,    @
gdP'8,   @
8,   Yb  @
\`Ya, ,8) @
  "Y88P88@
         @
         @
         @
         @
         @
         @@
220 SANS-t
        @
   I8   @
   I8   @
88888888@
   I8   @
 ,dI8   @
 P"I8   @
   I8,  @
   \`8b,_@
    "Y88@
        @
        @
        @
        @
        @
        @@
221 SANS-u
           @
           @
           @
           @
           @
gg      gg @
88      8I @
I8,    ,8I @
\`8b,  ,d8b,@
  "Y88P"\`Y8@
           @
           @
           @
           @
           @
           @@
222 SANS-v
           @
           @
           @
           @
           @
,gg    gg  @
P"Yb   88bg@
  I8   8I  @
  I8, ,8I  @
   "Y8P"   @
           @
           @
           @
           @
           @
           @@
223 SANS-w
                @
                @
                @
                @
                @
gg    gg    gg  @
88    I8    88bg@
I8    I8    8I  @
I8,  ,d8,  ,8I  @
 "Y88P""Y88P"   @
                @
                @
                @
                @
                @
                @@
224 SANS-x
          @
          @
          @
          @
          @
,gg,   ,gg@
P""8b,dP" @
   ,88"   @
 ,dP"Y8,  @
dP"   "Y8 @
          @
          @
          @
          @
          @
          @@
225 SANS-y
          @
          @
          @
          @
          @
gg     gg @
88     8I @
I8,   ,8I @
I8b, ,d8I @
 "Y88P"888@
     ,d8I'@
   ,dP'8I @
  ,8"  8I @
  I8   8I @
  \`8, ,8I @
   \`Y8P"  @@
226 SANS-z
        @
        @
        @
        @
        @
 ,gggg, @
dP"  Yb @
     dP @
  ,adP' @
  ""Y8d8@
   ,d8I'@
 ,dP'8I @
,8"  8I @
I8   8I @
\`8, ,8I @
 \`Y8P"  @@
`