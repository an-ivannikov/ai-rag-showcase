# Makefile for rendering architecture diagram via Graphviz

DOT=architecture.dot
PNG=architecture.png
SVG=architecture.svg

all: png svg

png:
	dot -Tpng $(DOT) -o $(PNG)

svg:
	dot -Tsvg $(DOT) -o $(SVG)

clean:
	rm -f $(PNG) $(SVG)
