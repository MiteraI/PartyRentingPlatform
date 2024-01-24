using PartyRentingPlatform.Crosscutting.Constants;

namespace PartyRentingPlatform.Crosscutting.Exceptions;

public class InternalServerErrorException : BaseException
{
    public InternalServerErrorException(string message) : base(ErrorConstants.DefaultType, message)
    {
    }
}
