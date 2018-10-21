src="screen-grab.mp4"
dest="screen-grab.gif"
palette="/tmp/palette.png"

ffmpeg -i $src -vf palettegen -y $palette
ffmpeg -i $src -i $palette -lavfi paletteuse -y $dest
