failed=0
i=0

for directory in `ls -d */`
do
  directory=`echo $directory | tr -d '/'`
  i=$(($i+1))
  echo "##### started test $directory #####"
  cd $directory
  cat input.txt | node ../../formatter.js > .output_$directory
  difference=`diff expected_output.txt .output_$directory --strip-trailing-cr`
  if [[ $difference != "" ]]
  then
    echo "$difference"
    failed=$(($failed+1))
    echo "##### test $directory FAILED #####"
  else
    echo "##### test $directory ended OK #####"
  fi
  rm .output_$directory
  cd ..
  echo ""
done

if [[ $failed = 0 ]]
then
  echo "ALL TESTS PASSED"
else
  echo "FAILED TESTS: $failed / $i"
fi