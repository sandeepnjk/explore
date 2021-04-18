#!/bin/bash
help()
{
    echo ""
    echo "Usage: $0 -i input_folder -o output_folder -f output_filename"
    echo -e "\t -i absolute path to the input folder containing the csv's"
    echo -e "\t -o absolute path to the output folder for the combined csv"
    echo -e "\t -f output filename"
    exit -1
}

while getopts "i:o:f:" opt
do
    case "$opt" in
	i ) input_folder="$OPTARG" ;;
	o ) output_folder="$OPTARG" ;;
	f ) out_filename="$OPTARG" ;;
	? ) help ;;
    esac
done

if [ -z "$input_folder" ] || [ -z "$output_folder" ] || [ -z "$out_filename" ]
then
    echo "Parameters missing"
    help
fi


output_file="${input_folder}/${out_filename}"
i=0
for filename in "${input_folder}/*"; do
 echo "$filename"
 if [ "$filename"  != "out_filename" ] ;      # Avoid recursion 
 then 
   if [[ $i -eq 0 ]] ; then 
      head -1  "$filename" >   "$out_filename" # Copy header if it is the first file
   fi
   tail -n +2  "$filename" >>  "$out_filename" # Append from the 2nd line each file
   i=$(( $i + 1 ))                            # Increase the counter
 fi
done
