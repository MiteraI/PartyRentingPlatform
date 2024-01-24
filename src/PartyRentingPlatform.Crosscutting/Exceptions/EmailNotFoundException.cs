using PartyRentingPlatform.Crosscutting.Constants;

namespace PartyRentingPlatform.Crosscutting.Exceptions;

public class EmailNotFoundException : BaseException
{
    public EmailNotFoundException() : base(ErrorConstants.EmailNotFoundType, "Email address not registered")
    {
    }
}
